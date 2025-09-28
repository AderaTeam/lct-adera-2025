import type { Knex } from 'knex';

import appConfig from '../common/appConfig';

const knexConfig: Knex.Config = {
  client: 'pg',
  pool: {
    min: 2,
    max: appConfig.POSTGRES_CONNECTION_POOL_SIZE,
  },
  connection: {
    host: appConfig.POSTGRES_HOST,
    port: appConfig.POSTGRES_PORT,
    user: appConfig.POSTGRES_USER,
    password: appConfig.POSTGRES_PASSWORD,
    database: appConfig.POSTGRES_DB,
    ssl: appConfig.POSTGRES_SSL ? { rejectUnauthorized: false } : false,
  },
};

export default knexConfig;
