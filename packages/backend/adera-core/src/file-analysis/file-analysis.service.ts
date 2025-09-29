import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { S3Service } from 'src/s3/s3.service';
import { FileAnalysisListDto } from './dto/file-analysis-list.dto';
import {
  FileAnalysisDetailDto,
  ToneSummaryDto,
  TopicStatsDto,
} from './dto/file-analysis-detail.dto';
import { AppError } from 'src/common/errors';
import { HttpStatus } from '@adera/common-enums';
import { AnalyzeResponseDto } from './dto/analyze-response.dto';
import { AnalyzeBodyDto } from './dto/analyze-body.dto';
import { db, DbTables } from 'src/db/db';

const moodMap: Record<string, keyof ToneSummaryDto> = {
  позитивный: 'positive',
  негативный: 'negative',
  нейтральный: 'neutral',
};

@Injectable()
export class FileAnalysisService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly httpService: HttpService,
  ) {}

  async findAll(): Promise<FileAnalysisListDto[]> {
    const data = await db(DbTables.FileAnalysis)
      .select<
        {
          id: number;
          object_key_url: string;
          object_key: string;
          created_at: string;
          reviews_count: number;
        }[]
      >('*')
      .orderBy('created_at', 'desc');

    return data.map((d) => ({
      id: d.id,
      objectKeyUrl: d.object_key_url,
      createdAt: d.created_at,
      reviewsCount: d.reviews_count,
    }));
  }

  async findOne(id: string): Promise<FileAnalysisDetailDto> {
    // Получаем все темы и сентименты для файла
    const rows = await db(DbTables.FileAnalysisPredictionTopic)
      .select<{ topic: string; sentiment: string }[]>('topic', 'sentiment')
      .join(
        DbTables.FileAnalysisPrediction,
        'file_analysis_prediction_topic.prediction_id',
        'file_analysis_prediction.id',
      )
      .where('file_analysis_prediction.file_analysis_id', id);

    if (!rows.length) {
      throw new AppError({
        statusCode: HttpStatus.NOT_FOUND,
        errorText: 'Анализ не найден',
      });
    }

    // Считаем суммарные тональности
    const summary: ToneSummaryDto = { positive: 0, negative: 0, neutral: 0 };
    const topicMap: Record<string, ToneSummaryDto> = {};

    for (const row of rows) {
      const key = moodMap[row.sentiment.toLowerCase()] || 'neutral';

      // Суммарно
      summary[key]++;

      // По топику
      if (!topicMap[row.topic]) {
        topicMap[row.topic] = { positive: 0, negative: 0, neutral: 0 };
      }
      topicMap[row.topic][key]++;
    }

    const topics: TopicStatsDto[] = Object.entries(topicMap).map(
      ([name, stats]) => ({
        name,
        ...stats,
      }),
    );

    return {
      id: Number(id),
      summary,
      topics,
    };
  }

  async create(objectKey: string) {
    const presignedUrl = this.s3Service.presignedGetObject(objectKey, false);

    const response = await firstValueFrom(
      this.httpService.get(presignedUrl, {
        responseType: 'json',
      }),
    );

    const jsonData: AnalyzeBodyDto = response.data;

    try {
      const analyzeResponse = await firstValueFrom(
        this.httpService.post<AnalyzeResponseDto>(
          'http://94.241.143.123:8000/get_analize', // вынести в .env
          jsonData,
          { headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const [fileAnalysisRecord] = await db(DbTables.FileAnalysis)
        .insert({
          object_key: objectKey,
          reviews_count: jsonData.data.length,
        })
        .returning('id');

      const fileAnalysisId = fileAnalysisRecord.id;

      for (const prediction of analyzeResponse.data.predictions) {
        const [predictionRecord] = await db(DbTables.FileAnalysisPrediction)
          .insert({
            file_analysis_id: fileAnalysisId,
            prediction_id: prediction.id,
          })
          .returning<{ id: number }[]>('id');

        const topicsData = prediction.topics.map((topic, idx) => ({
          prediction_id: predictionRecord.id,
          topic,
          sentiment: prediction.sentiments[idx] || 'нейтрально',
        }));

        if (topicsData.length) {
          await db(DbTables.FileAnalysisPredictionTopic).insert(topicsData);
        }
      }

      return { status: 200 };
    } catch (error) {
      throw new AppError({
        statusCode: HttpStatus.BAD_REQUEST,
        errorText: 'Не удалось выполнить анализ файла',
      });
    }
  }
}
