import {
  Controller,
  Put,
  Get,
  ValidationPipe,
  Query,
  UsePipes,
  Body,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';
import { PutPresignedUrlDto } from './dto/put-presigned-url.dto';
import { S3 } from './s3.utils';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  /**
   * GET, Получение ссылки для доступа к файлу
   */
  @Get('/presignedUrl')
  @UsePipes(new ValidationPipe({ transform: true }))
  getPresignedUrl(@Query() query: GetPresignedUrlDto) {
    const presignedUrl = this.s3Service.presignedGetObject(
      query.object_key,
      query.auto_download_attachment ?? false,
    );

    return { presignedUrl };
  }

  /**
   * PUT, Формирование ссылки для загрузки в s3 и objectKey
   * на основе названия файла
   */
  @Put('/presignedUrl')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  putPresignedUrl(@Body() body: PutPresignedUrlDto) {
    const generatedObjectKey = S3.generateObjectKeyByFileName(body.fileName);
    const presignedUrl = this.s3Service.presignedPutObject(
      generatedObjectKey,
      2,
    );

    return {
      presignedUrl,
      generatedObjectKey,
    };
  }
}
