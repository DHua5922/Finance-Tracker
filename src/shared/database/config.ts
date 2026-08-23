import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";

const databaseUrl = z.string().nonempty().parse(process.env.DATABASE_URL);

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(databaseUrl, { prepare: false });
export const db = drizzle(client);
