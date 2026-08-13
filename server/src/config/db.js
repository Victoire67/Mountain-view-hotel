// config/db.js
import dotenv from 'dotenv';
import pg from 'pg';
import dns from 'dns';

// Force IPv4 first — avoids ETIMEDOUT/ENETUNREACH on machines
// without a working IPv6 route (Node 18+ dual-stack behavior)
dns.setDefaultResultOrder('ipv4first');

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  family: 4,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

export default pool;