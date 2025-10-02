import { Injectable } from '@nestjs/common';
import { db, DbTables } from 'src/db/db';
import {
  DynamicsDto,
  ToneDynamicsDto,
  ToneSummaryDto,
  TopicStatsDto,
} from './dto/analytics.dto';
import { normalizeMood } from './helper/normalizeMood';
import { endOfDay, format, startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { splitPeriods } from 'src/common/utils/splitPeriods';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { getUTCTime } from 'src/db/getUTCTime';

const moodMap: Record<string, keyof ToneSummaryDto> = {
  положительно: 'positive',
  отрицательно: 'negative',
  нейтрально: 'neutral',
};

type RawMoodDateStatsRow = {
  review_date: string;
  mood: string;
  count: string;
};

@Injectable()
export class AnalyticsService {
  constructor() {}

  async getDashboard(query: DashboardQueryDto) {
    const [summary, topics, dynamics, toneDynamics] = await Promise.all([
      this.getToneSummary(query),
      this.getTopicsStats(query),
      this.getDynamics(query),
      this.getToneDynamics(query),
    ]);

    const total = dynamics.reduce((sum, { count }) => sum + count, 0);

    const positive = toneDynamics.reduce((max, d) =>
      d.positive > max.positive ? d : max,
    );
    const negative = toneDynamics.reduce((max, d) =>
      d.negative > max.negative ? d : max,
    );

    return {
      summary,
      topics,
      dynamics,
      toneDynamics,
      avgReviews: Math.round(total / dynamics.length),
      maxReviewsData: dynamics.reduce((maxObj, current) =>
        current.count > maxObj.count ? current : maxObj,
      ),
      anomalies: {
        positive: { amount: positive.positive, name: positive.name },
        negative: { amount: negative.negative, name: negative.name },
      },
    };
  }

  private async getToneSummary(
    filters: DashboardQueryDto,
  ): Promise<ToneSummaryDto> {
    const query = db({ rt: DbTables.ReviewTopics })
      .select<{ topic_mood: string; count: string }[]>('rt.topic_mood')
      .count('* as count')
      .join({ r: DbTables.Reviews }, 'rt.review_id', 'r.review_id')
      .groupBy('rt.topic_mood');

    const { from, to, topics } = filters;

    if (from && to) {
      query.whereBetween('r.review_date', [from, to]);
    }

    if (topics && topics.length) {
      query.whereIn('rt.topic_id', topics);
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
    filters: DashboardQueryDto,
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

    const { from, to, topics } = filters;

    if (from && to) {
      query.whereBetween('r.review_date', [from, to]);
    }

    if (topics && topics.length) {
      query.whereIn('rt.topic_id', topics);
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
    filters: DashboardQueryDto,
  ): Promise<DynamicsDto[]> {
    const { from, to, topics } = filters;

    const rows = await db({ r: DbTables.Reviews })
      .select<{ review_date: Date; count: string }[]>('r.review_date')
      .count('* as count')
      .modify((qb) => {
        if (topics && topics.length) {
          qb.join(
            { rt: DbTables.ReviewTopics },
            'rt.review_id',
            'r.review_id',
          ).whereIn('rt.topic_id', topics);
        }
      })
      .groupBy('r.review_date')
      .orderBy('r.review_date', 'asc');

    let data: { date: Date; count: number }[] = rows.map((r) => ({
      date: getUTCTime(r.review_date),
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
      const start = getUTCTime(from);
      const end = getUTCTime(to);
      const periods = splitPeriods(start, end);

      return periods.map((p) => {
        const start = startOfDay(p.start).getTime();
        const end = endOfDay(p.end).getTime();

        const count = data
          .filter((d) => {
            const time = new Date(d.date).getTime();
            return time >= start && time <= end;
          })
          .reduce((sum, d) => sum + d.count, 0);

        const name = `${format(p.start, 'dd.MM', { locale: ru })} - ${format(p.end, 'dd.MM', { locale: ru })}`;
        return { name, count };
      });
    }
  }

  private async getToneDynamics(
    filters: DashboardQueryDto,
  ): Promise<ToneDynamicsDto[]> {
    const query = db({ rt: DbTables.ReviewTopics })
      .select<
        RawMoodDateStatsRow[]
      >('r.review_date as reviewDate', 'rt.topic_mood as mood')
      .count('* as count')
      .join({ r: DbTables.Reviews }, 'rt.review_id', 'r.review_id')
      .join({ t: DbTables.Topics }, 'rt.topic_id', 't.topic_id')
      .groupBy('r.review_date', 'rt.topic_mood');

    const { from, to, topics } = filters;

    if (from && to) {
      query.whereBetween('r.review_date', [from, to]);
    }

    if (topics && topics.length) {
      query.whereIn('rt.topic_id', topics);
    }

    const rows = await query;

    let data: {
      review_date: Date;
      mood: string;
      count: number;
    }[] = rows.map((r) => ({
      review_date: getUTCTime(r.reviewDate.toString()),
      mood: normalizeMood(r.mood.toString()),
      count: Number(r.count),
    }));

    if (!from || !to) {
      const monthMap: Record<
        number,
        {
          positive: number;
          negative: number;
          neutral: number;
        }
      > = {};

      data.forEach((d) => {
        const month = d.review_date.getMonth();

        monthMap[month] = monthMap[month] || {
          positive: 0,
          negative: 0,
          neutral: 0,
        };

        if (d.mood in monthMap[month]) {
          monthMap[month][d.mood as 'positive' | 'negative' | 'neutral'] +=
            d.count;
        }
      });

      return Array.from({ length: 12 }, (_, i) => ({
        name: format(new Date(0, i), 'LLLL', { locale: ru }), // Январь, Февраль
        positive: monthMap[i] ? monthMap[i].positive : 0,
        negative: monthMap[i] ? monthMap[i].negative : 0,
        neutral: monthMap[i] ? monthMap[i].neutral : 0,
      })).filter((m) => Boolean(m.negative || m.positive || m.neutral));
    } else {
      const start = getUTCTime(from);
      const end = getUTCTime(to);
      const periods = splitPeriods(start, end);

      return periods.map((p) => {
        let amounts = {
          positive: 0,
          negative: 0,
          neutral: 0,
        };

        const start = startOfDay(p.start).getTime();
        const end = endOfDay(p.end).getTime();

        const counts = data.filter((d) => {
          const time = new Date(d.review_date).getTime();

          return time >= start && time <= end;
        });
        counts.forEach((c) => {
          amounts[c.mood as 'positive' | 'negative' | 'neutral'] += c.count;
        });
        const name = `${format(p.start, 'dd.MM', { locale: ru })} - ${format(p.end, 'dd.MM')}`;
        return { name, ...amounts };
      });
    }
  }
}
