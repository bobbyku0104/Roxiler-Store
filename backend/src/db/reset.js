const { Client } = require('pg');
const config = require('../config/env');
const { pool } = require('../config/db');
const { migrate, ensureDatabase } = require('./migrate');
const { seed } = require('./seed');

async function reset() {
  if (config.nodeEnv === 'production') {
    throw new Error('Refusing to reset the database when NODE_ENV=production');
  }

  await ensureDatabase();

  const client = new Client(config.db);
  await client.connect();
  try {
    await client.query('DROP SCHEMA public CASCADE');
    await client.query('CREATE SCHEMA public');
    console.log('Dropped all tables');
  } finally {
    await client.end();
  }

  await migrate();
  await seed();
}

reset()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
