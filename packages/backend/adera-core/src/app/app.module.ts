import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DirectoriesModule } from 'src/directories/directories.module';
import { S3Module } from 'src/s3/s3.module';
import { FileAnalysisModule } from 'src/file-analysis/file-analysis.module';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [DirectoriesModule, S3Module, FileAnalysisModule, AnalyticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
