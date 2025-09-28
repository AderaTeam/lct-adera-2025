import type { Knex } from 'knex';

import process from 'node:process';

const env = process.env;

const knexConfig: Knex.Config = {
  client: 'pg',
  pool: {
    min: 2,
    max: +env.POSTGRES_CONNECTION_POOL_SIZE,
  },
  debug: !!env.DEBUG_SQL || undefined,
  connection: {
    host: env.POSTGRES_HOST,
    port: +env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    ssl: env.POSTGRES_SSL ? { rejectUnauthorized: false } : false,
  },
};

export default knexConfig;
