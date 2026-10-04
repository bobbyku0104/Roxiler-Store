require('dotenv').config();

// Hosting providers such as Render hand out a single DATABASE_URL;
// locally the individual DB_* variables are used instead.
const usesDatabaseUrl = Boolean(process.env.DATABASE_URL);

const REQUIRED = usesDatabaseUrl
  ? ['DATABASE_URL', 'JWT_SECRET']
  : ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Copy backend/.env.example to backend/.env and fill in the values.');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters long in production.');
  process.exit(1);
}

// Accepts a comma separated list. Trailing slashes are dropped because the
// browser's Origin header never has one, and a stray "/" is an easy mistake.
function parseOrigins(value) {
  return value
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN || 'http://localhost:5173'),
  // Number of reverse proxies in front of the app (1 on Render), so rate
  // limiting sees the visitor's IP instead of the proxy's.
  trustProxy: Number(process.env.TRUST_PROXY) || 0,
  seedDemoData:
    process.env.SEED_DEMO_DATA === 'true' ||
    (process.env.NODE_ENV !== 'production' && process.env.SEED_DEMO_DATA !== 'false'),
  db: usesDatabaseUrl
    ? { connectionString: process.env.DATABASE_URL, ssl }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl,
      },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  admin: {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
};
