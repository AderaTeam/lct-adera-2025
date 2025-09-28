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

  @Get("amount-dynamic")
  getAmountDynamic(): AmountDynamicDto[]{
    return [{name: "a", amount: 10000}]
    //TODO
  }

  @Get("tone-dynamic")
  getToneDynamic(): ToneDynamicDto[]{
    return [{name: "Январь", negative: 10, neutral: 240, positive: 500}]
    //TODO
  }

  @Get("main-analytics")
  getMainAnalytics(): MainAnalytiscDataDto{
    return {counts: {negativeCount: 1, neutralCount: 2, positiveCount: 3}, topics: [{name: "Кредит", negativeCount: 1, neutralCount: 2, positiveCount: 4}]}
    //TODO
  }
}
