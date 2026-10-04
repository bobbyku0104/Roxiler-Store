const { query } = require('../config/db');
const ApiError = require('../utils/ApiError');
const { ROLES } = require('../utils/roles');
const { Filters, orderBy } = require('../utils/sql');

const ADMIN_STORE_SORT = {
  name: 's.name',
  email: 's.email',
  address: 's.address',
  rating: 'AVG(r.rating)',
  createdAt: 's.created_at',
};

const USER_STORE_SORT = {
  name: 's.name',
  address: 's.address',
  rating: 'AVG(r.rating)',
  myRating: 'mine.rating',
};

async function listStoresForAdmin(filters) {
  const where = new Filters()
    .contains('s.name', filters.name)
    .contains('s.email', filters.email)
    .contains('s.address', filters.address);

  const { rows } = await query(
    `SELECT s.id, s.name, s.email, s.address, s.created_at AS "createdAt",
            o.id AS "ownerId", o.name AS "ownerName",
            ROUND(AVG(r.rating), 1)::float AS "averageRating",
            COUNT(r.id)::int AS "ratingCount"
     FROM stores s
     LEFT JOIN users o ON o.id = s.owner_id
     LEFT JOIN ratings r ON r.store_id = s.id
     ${where.where()}
     GROUP BY s.id, o.id
     ${orderBy(filters, ADMIN_STORE_SORT, { defaultSort: 'name', tieBreaker: 's.id' })}`,
    where.params
  );

  return rows;
}

async function listStoresForUser(userId, filters) {
  const where = new Filters([userId])
    .contains('s.name', filters.name)
    .contains('s.address', filters.address);

  const { rows } = await query(
    `SELECT s.id, s.name, s.address,
            ROUND(AVG(r.rating), 1)::float AS "averageRating",
            COUNT(r.id)::int AS "ratingCount",
            mine.rating AS "myRating"
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     LEFT JOIN ratings mine ON mine.store_id = s.id AND mine.user_id = $1
     ${where.where()}
     GROUP BY s.id, mine.rating
     ${orderBy(filters, USER_STORE_SORT, { defaultSort: 'name', tieBreaker: 's.id' })}`,
    where.params
  );

  return rows;
}

async function createStore({ name, email, address, ownerId }) {
  if (ownerId) {
    const { rows } = await query('SELECT role FROM users WHERE id = $1', [ownerId]);
    if (!rows.length || rows[0].role !== ROLES.OWNER) {
      throw ApiError.badRequest('Selected owner must be a store owner', [
        { field: 'ownerId', message: 'Selected user is not a store owner' },
      ]);
    }
  }

  try {
    const { rows } = await query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, address, owner_id AS "ownerId", created_at AS "createdAt"`,
      [name, email, address || null, ownerId || null]
    );
    return rows[0];
  } catch (err) {
    if (err.constraint === 'stores_email_key') {
      throw ApiError.conflict('A store with this email already exists');
    }
    if (err.constraint === 'stores_owner_id_key') {
      throw ApiError.conflict('This owner already has a store');
    }
    throw err;
  }
}

async function rateStore(userId, storeId, rating) {
  try {
    const { rows } = await query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id) DO UPDATE SET rating = EXCLUDED.rating
       RETURNING id, store_id AS "storeId", rating, updated_at AS "updatedAt", (xmax = 0) AS created`,
      [userId, storeId, rating]
    );

    const { created, ...saved } = rows[0];
    return { created, rating: saved };
  } catch (err) {
    if (err.code === '23503') {
      throw ApiError.notFound('Store not found');
    }
    throw err;
  }
}

module.exports = { listStoresForAdmin, listStoresForUser, createStore, rateStore };
