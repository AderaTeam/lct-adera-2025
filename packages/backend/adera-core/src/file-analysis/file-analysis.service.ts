import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { S3Service } from 'src/s3/s3.service';
import { FileAnalysisListDto } from './dto/file-analysis-list.dto';
import { FileAnalysisDetailDto } from './dto/file-analysis-detail.dto';

@Injectable()
export class FileAnalysisService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly httpService: HttpService,
  ) {}

  async findAll(): Promise<FileAnalysisListDto[]> {
    return [
      {
        id: '1',
        objectKeyUrl:
          'https://i.pinimg.com/736x/43/e7/33/43e73384abc32848764c3bdd8d48e680.jpg',
        createdAt: '2025-09-25T18:52:00.000Z',
        reviewsCount: 300,
      },
      {
        id: '2',
        objectKeyUrl:
          'https://i.pinimg.com/736x/43/e7/33/43e73384abc32848764c3bdd8d48e680.jpg',
        createdAt: '2025-09-13T18:00:00.000Z',
        reviewsCount: 150,
      },
    ];
  }

  async findOne(id: string): Promise<FileAnalysisDetailDto> {
    return {
      id,
    };
  }

  async create(objectKey: string) {
    const presignedUrl = this.s3Service.presignedGetObject(objectKey, false);

    const response = await firstValueFrom(
      this.httpService.get(presignedUrl, {
        responseType: 'json',
      }),
    );

    const jsonData = response.data;

    await new Promise((resolve) => setTimeout(resolve, 5000));

    return jsonData;
  }
}
