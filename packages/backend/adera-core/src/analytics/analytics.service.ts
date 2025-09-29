import { Injectable } from '@nestjs/common';
import { db, DbTables } from 'src/db/db';

export type ToneSummary = {
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
};

const moodMap: Record<string, keyof ToneSummary> = {
  позитивный: 'positiveCount',
  негативный: 'negativeCount',
  нейтральный: 'neutralCount',
};

@Injectable()
export class AnalyticsService {
  constructor() {}

  async getDashboard() {
    const [summary] = await Promise.all([this.getToneSummary()]);

    return {
      summary,
    };
  }

  private async getToneSummary(
    from?: string,
    to?: string,
  ): Promise<ToneSummary> {
    const query = db({ rt: DbTables.ReviewTopics })
      .select<{ topic_mood: string; count: string }[]>('rt.topic_mood')
      .count('* as count')
      .join({ r: DbTables.Reviews }, 'rt.review_id', 'r.review_id')
      .groupBy('rt.topic_mood');

    if (from && to) {
      query.whereBetween('r.review_date', [from, to]);
    }

    const rows = await query;

    return rows.reduce<ToneSummary>(
      (acc, row) => {
        const mapped = moodMap[row.topic_mood];
        if (mapped) {
          acc[mapped] += Number(row.count);
        }
        return acc;
      },
      { positiveCount: 0, negativeCount: 0, neutralCount: 0 },
    );
  }
}
