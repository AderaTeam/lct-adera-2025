import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * GET, Получение списка проведенных анализов
   */
  @Get('dashboard')
  async getDashboard() {
    return this.analyticsService.getDashboard();
  }
}
