const { Pool } = require('pg');

let pool;

function getPool() {
  if (pool) return pool;

  const config = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        // Render 등 클라우드 PostgreSQL은 SSL 필수
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        database: process.env.DB_NAME || 'coffe_order_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
      };

  pool = new Pool(config);
  return pool;
}

async function query(text, params) {
  const client = getPool();
  return client.query(text, params);
}

async function testConnection() {
  const client = getPool();
  const res = await client.query('SELECT NOW()');
  return res.rows[0];
}

module.exports = { getPool, query, testConnection };
