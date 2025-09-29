import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, S3Service],
})
export class AnalyticsModule {}
