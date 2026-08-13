import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// Initialize PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                  // Maximum 20 simultaneous DB connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Error timeout after 2 seconds
});

pool.on('connect', () => {
  console.log('🐘 PostgreSQL Database Connected Successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected DB Error:', err);
  process.exit(-1);
});

export default pool;