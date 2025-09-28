import knex from 'knex';

import knexConfig from './knexConfig';

/**
 * Enum отражающий доступные таблицы в БД
 */
export const DbTables = {};

/**
 * Клиент Knex подключённый к БД
 */
export const db = knex({
  ...knexConfig,
});
