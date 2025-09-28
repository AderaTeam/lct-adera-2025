/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // ---------- Таблица источников ----------
  await knex.schema.createTable('sources', (table) => {
    table.increments('source_id').primary();
    table.string('source_name', 100).notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ---------- Таблица городов ----------
  await knex.schema.createTable('cities', (table) => {
    table.increments('city_id').primary();
    table.string('city_name', 100).notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ---------- Таблица отзывов ----------
  await knex.schema.createTable('reviews', (table) => {
    table.increments('review_id').primary();
    table.string('review_title', 500).notNullable();
    table.text('review_text').notNullable();
    table.integer('rating');
    table.date('review_date');

    table
      .integer('city_id')
      .references('city_id')
      .inTable('cities')
      .onDelete('SET NULL');

    table
      .integer('source_id')
      .references('source_id')
      .inTable('sources')
      .onDelete('SET NULL');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // ---------- Таблица тем ----------
  await knex.schema.createTable('topics', (table) => {
    table.increments('topic_id').primary();
    table.string('topic_name', 100).notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ---------- Связка отзывов и тем ----------
  await knex.schema.createTable('review_topics', (table) => {
    table.increments('review_topic_id').primary();

    table
      .integer('review_id')
      .references('review_id')
      .inTable('reviews')
      .onDelete('CASCADE');

    table
      .integer('topic_id')
      .references('topic_id')
      .inTable('topics')
      .onDelete('CASCADE');

    table.string('topic_mood', 50);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.unique(['review_id', 'topic_id']);
  });

  // ---------- Индексы ----------
  await knex.schema.alterTable('reviews', (table) => {
    table.index(['review_date'], 'idx_reviews_date');
    table.index(['rating'], 'idx_reviews_rating');
    table.index(['city_id'], 'idx_reviews_city');
    table.index(['source_id'], 'idx_reviews_source');
  });

  await knex.schema.alterTable('review_topics', (table) => {
    table.index(['review_id'], 'idx_review_topics_review');
    table.index(['topic_id'], 'idx_review_topics_topic');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down() {
  // ---------- Удаление индексов ----------
  await knex.schema.alterTable('review_topics', (table) => {
    table.dropIndex([], 'idx_review_topics_review');
    table.dropIndex([], 'idx_review_topics_topic');
  });

  await knex.schema.alterTable('reviews', (table) => {
    table.dropIndex([], 'idx_reviews_date');
    table.dropIndex([], 'idx_reviews_rating');
    table.dropIndex([], 'idx_reviews_city');
    table.dropIndex([], 'idx_reviews_source');
  });

  // ---------- Удаление таблиц ----------
  await knex.schema.dropTableIfExists('review_topics');
  await knex.schema.dropTableIfExists('topics');
  await knex.schema.dropTableIfExists('reviews');
  await knex.schema.dropTableIfExists('cities');
  await knex.schema.dropTableIfExists('sources');
}
