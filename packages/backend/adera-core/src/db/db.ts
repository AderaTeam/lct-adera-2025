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
  FileAnalysis: 'file_analysis',
  FileAnalysisPrediction: 'file_analysis_prediction',
  FileAnalysisPredictionTopic: 'file_analysis_prediction_topic',
};

/**
 * Клиент Knex подключённый к БД
 */
export const db = knex({
  ...knexConfig,
});
