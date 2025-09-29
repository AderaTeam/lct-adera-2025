import { Controller, Get } from '@nestjs/common';
import { DirectoriesService } from './directories.service';

@Controller('directories')
export class DirectoriesController {
  constructor(private readonly directoriesService: DirectoriesService) {}

  /**
   * GET, Получение источников отзывов
   */
  @Get('/sources')
  async findSources() {
    return await this.directoriesService.findSources();
  }

  /**
   * GET, Получение топиков
   */
  @Get('/topics')
  async findProducts() {
    return this.directoriesService.findTopics();
  }

  /**
   * GET, Получение минимальной и максимальной возможной даты отзыва
   */
  @Get('reviews-date-range')
  async getReviewsDateRange() {
    return this.directoriesService.getReviewsDateRange();
  }
}
