const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { query } = require('../config/db');
const ApiError = require('../utils/ApiError');

async function authenticate(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw ApiError.unauthorized();
  }

  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret, { algorithms: ['HS256'] });
  } catch {
    throw ApiError.unauthorized('Your session has expired, please log in again');
  }

  // Load the user on every request so deleted accounts and role changes apply immediately.
  const { rows } = await query(
    'SELECT id, name, email, address, role, token_version FROM users WHERE id = $1',
    [payload.sub]
  );

  const user = rows[0];
  if (!user) {
    throw ApiError.unauthorized('This account no longer exists');
  }

  if (payload.ver !== user.token_version) {
    throw ApiError.unauthorized('Your password was changed, please log in again');
  }

  const { token_version: _, ...publicUser } = user;
  req.user = publicUser;
  next();
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden();
    }
    next();
  };
}

module.exports = { authenticate, authorize };
