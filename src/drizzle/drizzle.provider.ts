import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schemas';
export const DrizzleAsyncProvider = 'DrizzleAsyncProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const uri = configService.get<string>('AUTH_DRIZZLE_URL');
      const pool = new Pool({
        connectionString: uri,
        ssl: false,
      });
      const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      return db;
    },
    exports: [DrizzleAsyncProvider],
  },
];
