import { Injectable } from '@nestjs/common';
import { ApiDirectory } from 'src/common/dto';
import { db, DbTables } from 'src/db/db';
import { getUTCTime } from 'src/db/getUTCTime';

@Injectable()
export class DirectoriesService {
  constructor() {}

  async findSources(): Promise<ApiDirectory[]> {
    const sources = await db(DbTables.Sources).select<
      { source_id: number; source_name: string }[]
    >('*');

    return sources.map((s) => ({ id: s.source_id, name: s.source_name }));
  }

  async findTopics(): Promise<ApiDirectory[]> {
    const topics = await db(DbTables.Topics).select<
      { topic_id: number; topic_name: string }[]
    >('*');

    return topics.map((t) => ({ id: t.topic_id, name: t.topic_name }));
  }

  async getReviewsDateRange(): Promise<{
    minDate: string | null;
    maxDate: string | null;
  }> {
    const result = await db
      .select(
        db.raw(
          `(MIN(review_date) - interval '1 day')::timestamptz as "minDate"`,
        ),
        db.raw(
          `(MAX(review_date) + interval '1 day')::timestamptz as "maxDate"`,
        ),
      )
      .from(DbTables.Reviews)
      .first<{ minDate: string; maxDate: string }>();

    return {
      minDate: result?.maxDate
        ? getUTCTime(result.minDate).toISOString()
        : null,
      maxDate: result?.maxDate
        ? getUTCTime(result.maxDate).toISOString()
        : null,
    };
  }
}
