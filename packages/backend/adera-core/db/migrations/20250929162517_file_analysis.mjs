/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.createTable('file_analysis', (table) => {
    table.bigIncrements('id').primary();
    table.text('object_key_url').nullable();
    table.string('object_key').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.integer('reviews_count').notNullable();
  });

  await knex.schema.createTable('file_analysis_prediction', (table) => {
    table.increments('id').primary(); // внутренний PK
    table.integer('file_analysis_id').notNullable();
    table.integer('prediction_id').notNullable(); // id из JSON
    table
      .foreign('file_analysis_id')
      .references('id')
      .inTable('file_analysis')
      .onDelete('CASCADE');
  });

  await knex.schema.createTable('file_analysis_prediction_topic', (table) => {
    table.increments('id').primary();
    table.integer('prediction_id').notNullable();
    table.string('topic').notNullable();
    table.string('sentiment').notNullable();

    table
      .foreign('prediction_id')
      .references('id')
      .inTable('file_analysis_prediction')
      .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTableIfExists('file_analysis');
  await knex.schema.dropTableIfExists('file_analysis_prediction_topic');
  await knex.schema.dropTableIfExists('file_analysis_prediction');
};
