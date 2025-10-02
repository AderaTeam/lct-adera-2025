import 'dotenv/config';
import { env } from 'process';
import { z } from 'zod';

export interface IAppConfig {
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  POSTGRES_SSL: boolean;
  POSTGRES_CONNECTION_POOL_SIZE: number;
  ML_API_URL: string;
}

const envValidationSchema = z.object({
  // Подключение к БД
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number().int().gte(0),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_SSL: z.coerce
    .string()
    .regex(/^(true|false)$/, 'POSTGRES_SSL must be boolean')
    .optional()
    .default('false')
    .transform((v) => v === 'true') as z.ZodType<boolean>,
  POSTGRES_CONNECTION_POOL_SIZE: z.coerce
    .number()
    .int()
    .gte(1)
    .optional()
    .default(16),

  ML_API_URL: z.string(),
});

const envValidationResult = envValidationSchema.safeParse(env);

if (!envValidationResult.success) {
  throw new Error(envValidationResult.error.message);
}

const appConfig: IAppConfig = envValidationResult.data;
export default appConfig;
