import knex from 'knex';

import knexConfig from './knexConfig';

/**
 * Enum отражающий доступные таблицы в БД
 */
export const DbTables = {
  Topics: 'topics',
  Sources: 'sources',
  Reviews: 'reviews',
  ReviewTopics: 'review_topics',
  Cities: 'cities',
};

/**
 * Клиент Knex подключённый к БД
 */
export const db = knex({
  ...knexConfig,
});
