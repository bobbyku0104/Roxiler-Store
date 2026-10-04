const config = require('./config/env');
const app = require('./app');
const { pool } = require('./config/db');

async function start() {
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    console.error(`Cannot connect to the database: ${err.message}`);
    console.error('Is PostgreSQL running, and have you run "npm run db:setup"?');
    process.exit(1);
  }

  const server = app.listen(config.port, () => {
    console.log(`API running on http://localhost:${config.port}`);
  });

  function shutdown(signal) {
    console.log(`${signal} received, shutting down...`);

    server.close(async () => {
      await pool.end();
      process.exit(0);
    });

    setTimeout(() => process.exit(1), 10000).unref();
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start();
