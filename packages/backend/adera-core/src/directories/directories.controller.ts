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
   * GET, Получение продуктов
   */
  @Get('/products')
  async findProducts() {
    return this.directoriesService.findProducts();
  }
}
