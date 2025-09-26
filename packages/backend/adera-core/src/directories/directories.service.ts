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
    return [];
  }
}
