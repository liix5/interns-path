// lib/db.ts - Singleton database connection for Neon PostgreSQL
import postgres from "postgres";

// ============================================================
// DATABASE SWITCH - Change this to toggle between databases
// ============================================================
const USE_DEV_DB = false; // Set to true to use development database
// ============================================================

const connectionConfig = {
  ssl: "require" as const,
  // Neon's PgBouncer runs in transaction mode - disable prepared statements
  prepare: false,
  // Connection timeout: Neon cold starts can take several seconds
  connect_timeout: 15,
  // Close idle connections after 20 seconds
  idle_timeout: 20,
  // Limit connections per instance - critical for serverless
  max: 5,
  // Disable type fetching on connect (incompatible with transaction-mode pooling)
  fetch_types: false,
};

// Select database URL based on switch
const databaseUrl = USE_DEV_DB
  ? process.env.DevDB!
  : process.env.POSTGRES_URL!;

// Singleton pattern to prevent connection pool multiplication
// In development, Next.js hot reloads re-import modules, creating new pools
// This uses globalThis to persist the connection across reloads
const globalForDb = globalThis as unknown as {
  sql: ReturnType<typeof postgres> | undefined;
};

export const sql =
  globalForDb.sql ?? postgres(databaseUrl, connectionConfig);

// In development, attach to global to survive hot reloads
// In production, this is a no-op since modules aren't reloaded
if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}
