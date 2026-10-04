const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { query } = require('../config/db');
const ApiError = require('../utils/ApiError');
const { ROLES } = require('../utils/roles');

const SALT_ROUNDS = 10;

// Compared against when the email is unknown, so both failure cases take the same time.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', SALT_ROUNDS);

// ver ties the token to users.token_version, see middleware/auth.js
function signToken(user) {
  return jwt.sign({ role: user.role, ver: user.token_version }, config.jwt.secret, {
    subject: String(user.id),
    expiresIn: config.jwt.expiresIn,
  });
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
  };
}

async function createUser({ name, email, address, password, role }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, address, role, created_at AS "createdAt", token_version`,
      [name, email, passwordHash, address || null, role]
    );

    const { token_version: tokenVersion, ...user } = rows[0];
    return { user, tokenVersion };
  } catch (err) {
    if (err.code === '23505') {
      throw ApiError.conflict('This email is already registered');
    }
    throw err;
  }
}

async function signup(data) {
  const { user, tokenVersion } = await createUser({ ...data, role: ROLES.USER });
  return {
    token: signToken({ ...user, token_version: tokenVersion }),
    user: toPublicUser(user),
  };
}

async function login(email, password) {
  const { rows } = await query(
    `SELECT id, name, email, address, role, password_hash, token_version
     FROM users
     WHERE email = $1`,
    [email]
  );
  const user = rows[0];

  const matches = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);
  if (!user || !matches) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  return { token: signToken(user), user: toPublicUser(user) };
}

async function changePassword(userId, currentPassword, newPassword) {
  const { rows } = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);

  const matches = await bcrypt.compare(currentPassword, rows[0].password_hash);
  if (!matches) {
    throw ApiError.badRequest('Current password is incorrect', [
      { field: 'currentPassword', message: 'Current password is incorrect' },
    ]);
  }

  if (currentPassword === newPassword) {
    throw ApiError.badRequest('New password must be different from the current one', [
      { field: 'newPassword', message: 'New password must be different from the current one' },
    ]);
  }

  // Bumping the version invalidates every older token; the caller gets a fresh one.
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const { rows: updated } = await query(
    `UPDATE users SET password_hash = $1, token_version = token_version + 1
     WHERE id = $2
     RETURNING id, role, token_version`,
    [passwordHash, userId]
  );

  return signToken(updated[0]);
}

module.exports = { signup, login, changePassword, createUser, toPublicUser };
