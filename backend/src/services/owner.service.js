const { query } = require('../config/db');
const { orderBy } = require('../utils/sql');

const RATER_SORT = {
  name: 'u.name',
  email: 'u.email',
  rating: 'r.rating',
  ratedAt: 'r.updated_at',
};

async function getDashboard(ownerId, filters) {
  const { rows: stores } = await query(
    `SELECT s.id, s.name, s.email, s.address,
            ROUND(AVG(r.rating), 1)::float AS "averageRating",
            COUNT(r.id)::int AS "ratingCount"
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.owner_id = $1
     GROUP BY s.id`,
    [ownerId]
  );

  const store = stores[0];
  if (!store) {
    return { store: null, raters: [] };
  }

  const { rows: raters } = await query(
    `SELECT u.id AS "userId", u.name, u.email, r.rating, r.updated_at AS "ratedAt"
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = $1
     ${orderBy(filters, RATER_SORT, { defaultSort: 'ratedAt', defaultOrder: 'desc', tieBreaker: 'r.id' })}`,
    [store.id]
  );

  return { store, raters };
}

module.exports = { getDashboard };
