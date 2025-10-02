import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { FileAnalysisService } from './file-analysis.service';
import { CreateFileAnalysisDto } from './dto/create-file-analysis.dto';
import { FileAnalysisQueryDto } from './dto/file-analysis-query.dto';

@Controller('file-analysis')
export class FileAnalysisController {
  constructor(private readonly fileAnalysisService: FileAnalysisService) {}

  /**
   * GET, Получение списка проведенных анализов
   */
  @Get()
  async findAll() {
    return this.fileAnalysisService.findAll();
  }

  /**
   * GET, Получение данных о проведенном анализе
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: FileAnalysisQueryDto,
  ) {
    const topicNames = query.topics
      ? decodeURIComponent(query.topics)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    return this.fileAnalysisService.findOne(id, topicNames);
  }

  /**
   * POST, Создание анализа
   */
  @Post()
  async create(@Body() body: CreateFileAnalysisDto) {
    return this.fileAnalysisService.create(body.objectKey);
  }

  /**
   * GET, Получение топиков конкретного анализа
   */
  @Get('/topics/:id')
  async getTopics(@Param('id') id: string) {
    return this.fileAnalysisService.getTopics(id);
  }
}
