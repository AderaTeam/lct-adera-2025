import { Injectable } from '@nestjs/common';
import { db, DbTables } from 'src/db/db';
import {
  DynamicsDto,
  ToneSummaryDto,
  TopicStatsDto,
} from './dto/analytics.dto';
import { normalizeMood } from './helper/normalizeMood';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { splitPeriods } from 'src/common/utils/splitPeriods';

const moodMap: Record<string, keyof ToneSummaryDto> = {
  позитивный: 'positive',
  негативный: 'negative',
  нейтральный: 'neutral',
};

@Injectable()
export class AnalyticsService {
  constructor() {}

  async getDashboard() {
    const [summary, topics, dynamics] = await Promise.all([
      this.getToneSummary(),
      this.getTopicsStats(),
      this.getDynamics(),
    ]);

    return {
      summary,
      topics,
      dynamics,
    };
  }

  private async getToneSummary(
    from?: string,
    to?: string,
  ): Promise<ToneSummaryDto> {
    const query = db({ rt: DbTables.ReviewTopics })
      .select<{ topic_mood: string; count: string }[]>('rt.topic_mood')
      .count('* as count')
      .join({ r: DbTables.Reviews }, 'rt.review_id', 'r.review_id')
      .groupBy('rt.topic_mood');

    if (from && to) {
      query.whereBetween('r.review_date', [from, to]);
    }

    const rows = await query;

    return rows.reduce<ToneSummaryDto>(
      (acc, row) => {
        const mapped = moodMap[row.topic_mood];
        if (mapped) {
          acc[mapped] += Number(row.count);
        }
        return acc;
      },
      { positive: 0, negative: 0, neutral: 0 },
    );
  }

  private async getTopicsStats(
    from?: string,
    to?: string,
  ): Promise<TopicStatsDto[]> {
    type RawTopicStatsRow = {
      topicName: string;
      mood: string;
      count: string;
    };

    const query = db({ rt: DbTables.ReviewTopics })
      .select<
        RawTopicStatsRow[]
      >('t.topic_name as topicName', 'rt.topic_mood as mood')
      .count('* as count')
      .join({ r: DbTables.Reviews }, 'rt.review_id', 'r.review_id')
      .join({ t: DbTables.Topics }, 'rt.topic_id', 't.topic_id')
      .groupBy('t.topic_name', 'rt.topic_mood');

    if (from && to) {
      query.whereBetween('r.review_date', [from, to]);
    }

    const rows = await query;

    const topicsMap = new Map<string, TopicStatsDto>();

    for (const row of rows) {
      const moodKey = normalizeMood(row.mood.toString());

      const _topicName = row.topicName.toString();

      if (!topicsMap.has(_topicName)) {
        topicsMap.set(_topicName, {
          name: _topicName,
          positive: 0,
          negative: 0,
          neutral: 0,
        });
      }

      const topicStats = topicsMap.get(_topicName)!;
      topicStats[moodKey] = Number(row.count);
    }

    return Array.from(topicsMap.values());
  }

  private async getDynamics(
    from?: string,
    to?: string,
  ): Promise<DynamicsDto[]> {
    const rows = await db(DbTables.Reviews)
      .select<{ review_date: Date; count: string }[]>('review_date')
      .count('* as count')
      .groupBy('review_date')
      .orderBy('review_date');

    let data: { date: Date; count: number }[] = rows.map((r) => ({
      date: new Date(r.review_date),
      count: Number(r.count),
    }));

    if (!from || !to) {
      const monthMap: Record<number, number> = {};
      data.forEach((d) => {
        const month = d.date.getMonth();
        monthMap[month] = (monthMap[month] || 0) + d.count;
      });

      return Array.from({ length: 12 }, (_, i) => ({
        name: format(new Date(0, i), 'LLLL', { locale: ru }), // Январь, Февраль
        count: monthMap[i] || 0,
      })).filter((m) => Boolean(m.count));
    } else {
      const start = new Date(from);
      const end = new Date(to);
      const periods = splitPeriods(start, end);

      return periods.map((p) => {
        const count = data
          .filter((d) => d.date >= p.start && d.date <= p.end)
          .reduce((sum, d) => sum + d.count, 0);
        const name = `${format(p.start, 'dd.MM', { locale: ru })} - ${format(p.end, 'dd.MM')}`;
        return { name, count };
      });
    }
  }
}
