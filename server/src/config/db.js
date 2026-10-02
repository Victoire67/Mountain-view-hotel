// config/db.js
import dotenv from 'dotenv';
import pg from 'pg';
import dns from 'dns';
import net from 'net';

// Force IPv4 first — avoids ETIMEDOUT/ENETUNREACH on machines
// without a working IPv6 route (Node 18+ dual-stack behavior)
dns.setDefaultResultOrder('ipv4first');
// Node gives each address only 250ms by default before trying the next one,
// which is too short for slower links to Neon (every attempt ends in ETIMEDOUT)
net.setDefaultAutoSelectFamilyAttemptTimeout(3000);

dotenv.config({ quiet: true });
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // PGSSLMODE=disable allows a plain local Postgres during development
  ssl: process.env.PGSSLMODE === 'disable' ? false : {
    rejectUnauthorized: false,
  },
  family: 4,
  // Serverless instances each get their own pool, so keep it small there
  max: Number(process.env.PG_POOL_MAX) || (process.env.VERCEL ? 3 : 10),
  idleTimeoutMillis: 30_000, // release idle connections before the provider kills them
  connectionTimeoutMillis: 10_000, // fail fast instead of hanging requests
  keepAlive: true,
});

// The pool discards the broken client by itself; a dropped idle connection
// (common with serverless Postgres such as Neon) must not take the API down.
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

export default pool;
