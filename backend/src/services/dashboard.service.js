const { query } = require('../config/db');

async function getTotals() {
  const { rows } = await query(
    `SELECT (SELECT COUNT(*) FROM users)::int   AS "totalUsers",
            (SELECT COUNT(*) FROM stores)::int  AS "totalStores",
            (SELECT COUNT(*) FROM ratings)::int AS "totalRatings"`
  );
  return rows[0];
}

module.exports = { getTotals };
