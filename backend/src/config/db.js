const { Pool } = require('pg');
const config = require('./env');

const pool = new Pool(config.db);

pool.on('error', (err) => {
  console.error('Unexpected database error:', err.message);
});

function query(text, params) {
  return pool.query(text, params);
}

async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, query, withTransaction };
