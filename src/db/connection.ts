import { Pool } from "pg";

export const pool = new Pool({
  connectionString: `postgresql://neondb_owner:${process.env.DB_PASSWORD}@ep-tiny-mud-amcfolyz-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require`,
});
