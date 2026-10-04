const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const config = require('../config/env');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function ensureDatabase() {
  // A DATABASE_URL points at a database the host already created for us.
  if (config.db.connectionString) return;

  const client = new Client({ ...config.db, database: 'postgres' });
  await client.connect();

  try {
    const { rowCount } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [
      config.db.database,
    ]);

    if (!rowCount) {
      const name = config.db.database.replace(/"/g, '""');
      await client.query(`CREATE DATABASE "${name}"`);
      console.log(`Created database "${config.db.database}"`);
    }
  } finally {
    await client.end();
  }
}

async function migrate() {
  await ensureDatabase();

  const client = new Client(config.db);
  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name       VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const { rows } = await client.query('SELECT name FROM schema_migrations');
    const applied = new Set(rows.map((row) => row.name));

    const pending = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith('.sql') && !applied.has(file))
      .sort();

    for (const file of pending) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`Applied ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Migration ${file} failed: ${err.message}`);
      }
    }

    console.log(pending.length ? 'Migrations complete' : 'Database is already up to date');
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  migrate().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = { migrate, ensureDatabase };
