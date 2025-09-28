import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FileAnalysisService } from './file-analysis.service';
import { FileAnalysisController } from './file-analysis.controller';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [FileAnalysisController],
  providers: [FileAnalysisService, S3Service],
})
export class FileAnalysisModule {}
