import 'dotenv/config';
import { z } from 'zod';

interface Env {
  PORT: number;
  NODE_ENV: string;
  AUTH_DRIZZLE_URL: string;
  JWT_SECRET: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  SESSION_SECRET: string;
}

const envSchema = z.object({
  PORT: z
    .string()
    .default('3000')
    .transform((v) => parseInt(v, 10)),
  NODE_ENV: z.string().default('development'),
  AUTH_DRIZZLE_URL: z.string(),
  JWT_SECRET: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  SESSION_SECRET: z.string(),
});

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) {
  console.error(error);
  process.exit(1);
}

const env = data as Env;

export default () => ({
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  authDrizzleUrl: env.AUTH_DRIZZLE_URL,
  jwtSecret: env.JWT_SECRET,
  accessTokenSecret: env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: env.REFRESH_TOKEN_SECRET,
  sessionSecret: env.SESSION_SECRET,
});
