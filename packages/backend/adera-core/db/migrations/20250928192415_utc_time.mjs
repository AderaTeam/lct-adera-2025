/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  // перевод Postgres в режим UTC
  await knex.schema.raw("SET TIME ZONE 'UTC';");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  // никаких действий производить не нужно
};
