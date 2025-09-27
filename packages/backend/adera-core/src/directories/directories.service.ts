import { Injectable } from '@nestjs/common';
import { ApiDirectory } from 'src/common/dto';

@Injectable()
export class DirectoriesService {
  constructor() {}

  async findSources(): Promise<ApiDirectory[]> {
    return [
      { id: 1, name: 'Банки.ру' },
      { id: 2, name: 'Сравни.ру' },
    ];
  }

  async findProducts(): Promise<ApiDirectory[]> {
    return [
      { name: 'Счет', id: 1 },
      { name: 'Мобильное приложение', id: 2 },
      { name: 'Ипотека', id: 3 },
      { name: 'Дебетовые карты', id: 4 },
      { name: 'online сервис', id: 5 },
      { name: 'Банковские сейфы', id: 6 },
      { name: 'Денежные переводы', id: 7 },
      { name: 'Депозитарные услуги', id: 8 },
      { name: 'Мобильное приложение2', id: 9 },
      { name: 'Инвестиции и брокерское обслуживание', id: 10 },
      { name: 'Обмен валют', id: 11 },
      { name: 'Погашение кредита', id: 12 },
      { name: 'Кредитный карты', id: 13 },
    ];
  }
}
