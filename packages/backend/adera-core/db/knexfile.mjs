import process from 'node:process';

const env = process.env;

const config = {
  client: 'pg',
  connection: {
    host: env?.POSTGRES_HOST,
    port: env?.POSTGRES_PORT,
    user: env?.POSTGRES_USER,
    password: env?.POSTGRES_PASSWORD,
    database: env?.POSTGRES_DB,
    ssl: env?.POSTGRES_SSL === 'true' || env?.POSTGRES_SSL === true ? { rejectUnauthorized: false } : false
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
    loadExtensions: ['.mjs']
  },
  seeds: {
    directory: './seeds',
    loadExtensions: ['.mjs']
  }
};

export default config;
