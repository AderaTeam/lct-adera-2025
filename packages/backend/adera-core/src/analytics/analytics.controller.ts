import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * GET, Получение данных о дашборде
   */
  @Get('dashboard')
  async getDashboard(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: DashboardQueryDto,
  ) {
    return this.analyticsService.getDashboard(query);
  }
}
