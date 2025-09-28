import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FileAnalysisService } from './file-analysis.service';
import { CreateFileAnalysisDto } from './dto/create-file-analysis.dto';

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
  async findOne(@Param('id') id: string) {
    return this.fileAnalysisService.findOne(id);
  }

  /**
   * POST, Создание анализа
   */
  @Post()
  async create(@Body() body: CreateFileAnalysisDto) {
    return this.fileAnalysisService.create(body.objectKey);
  }
}
