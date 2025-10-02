import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AmountDynamicDto } from 'src/common/dto/amount-dynamic.dto';
import { ToneDynamicDto } from 'src/common/dto/tone-dynamic.dto';
import { MainAnalytiscDataDto } from 'src/common/dto/main-analytics-data.dto';

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
