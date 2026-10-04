const { query } = require('../config/db');
const ApiError = require('../utils/ApiError');
const { ROLES } = require('../utils/roles');
const { Filters, orderBy } = require('../utils/sql');

const USER_SORT = {
  name: 'u.name',
  email: 'u.email',
  address: 'u.address',
  role: 'u.role::text',
  createdAt: 'u.created_at',
};

async function listUsers(filters) {
  const where = new Filters()
    .contains('u.name', filters.name)
    .contains('u.email', filters.email)
    .contains('u.address', filters.address)
    .equals('u.role', filters.role || undefined);

  const { rows } = await query(
    `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at AS "createdAt"
     FROM users u
     ${where.where()}
     ${orderBy(filters, USER_SORT, { defaultSort: 'name', tieBreaker: 'u.id' })}`,
    where.params
  );

  return rows;
}

async function getUserById(id) {
  const { rows } = await query(
    `SELECT id, name, email, address, role, created_at AS "createdAt"
     FROM users
     WHERE id = $1`,
    [id]
  );

  const user = rows[0];
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (user.role === ROLES.OWNER) {
    const { rows: stores } = await query(
      `SELECT s.id, s.name,
              ROUND(AVG(r.rating), 1)::float AS "averageRating",
              COUNT(r.id)::int AS "ratingCount"
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = $1
       GROUP BY s.id`,
      [id]
    );
    user.store = stores[0] || null;
  }

  return user;
}

async function listOwners() {
  const { rows } = await query(
    `SELECT u.id, u.name, u.email, (s.id IS NOT NULL) AS "hasStore"
     FROM users u
     LEFT JOIN stores s ON s.owner_id = u.id
     WHERE u.role = $1
     ORDER BY u.name ASC`,
    [ROLES.OWNER]
  );

  return rows;
}

module.exports = { listUsers, getUserById, listOwners };
