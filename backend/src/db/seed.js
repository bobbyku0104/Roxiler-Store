const bcrypt = require('bcryptjs');
const config = require('../config/env');
const { pool, withTransaction } = require('../config/db');
const { ROLES } = require('../utils/roles');
const { MESSAGES, isValidEmail, isValidPassword, isValidPersonName } = require('../utils/rules');

const DEMO_PASSWORDS = {
  owner: 'Owner@123',
  user: 'User@1234',
};

const OWNERS = [
  {
    name: 'Rajesh Kumar Store Owner',
    email: 'owner1@storerating.com',
    address: '12 MG Road, Bengaluru, Karnataka',
    store: {
      name: 'Fresh Mart Supermarket',
      email: 'contact@freshmart.com',
      address: '45 Brigade Road, Bengaluru, Karnataka',
    },
  },
  {
    name: 'Priya Sharma Boutique Owner',
    email: 'owner2@storerating.com',
    address: '8 Linking Road, Bandra West, Mumbai',
    store: {
      name: 'Urban Style Clothing',
      email: 'hello@urbanstyle.com',
      address: '21 Hill Road, Bandra West, Mumbai',
    },
  },
];

const STORES_WITHOUT_OWNER = [
  {
    name: 'Book Nook Corner',
    email: 'info@booknook.com',
    address: '3 College Street, Kolkata, West Bengal',
  },
  {
    name: 'Daily Brew Coffee House',
    email: 'orders@dailybrew.com',
    address: '67 Park Street, Pune, Maharashtra',
  },
];

const USERS = [
  { name: 'Amit Verma Regular Customer', email: 'user1@storerating.com', address: 'Sector 15, Noida' },
  { name: 'Sneha Patel Regular Customer', email: 'user2@storerating.com', address: 'Navrangpura, Ahmedabad' },
  { name: 'Rohan Gupta Regular Customer', email: 'user3@storerating.com', address: 'Banjara Hills, Hyderabad' },
];

// [user email, store email, rating]
const RATINGS = [
  ['user1@storerating.com', 'contact@freshmart.com', 5],
  ['user2@storerating.com', 'contact@freshmart.com', 4],
  ['user3@storerating.com', 'contact@freshmart.com', 4],
  ['user1@storerating.com', 'hello@urbanstyle.com', 3],
  ['user2@storerating.com', 'hello@urbanstyle.com', 5],
  ['user1@storerating.com', 'info@booknook.com', 4],
  ['user3@storerating.com', 'orders@dailybrew.com', 2],
];

function checkAdminConfig() {
  const { name, email, password } = config.admin;
  const problems = [];

  if (!isValidPersonName(name)) problems.push(`ADMIN_NAME: ${MESSAGES.name}`);
  if (!isValidEmail(email)) problems.push(`ADMIN_EMAIL: ${MESSAGES.email}`);
  if (!isValidPassword(password)) problems.push(`ADMIN_PASSWORD: ${MESSAGES.password}`);

  if (problems.length) {
    throw new Error(
      `Invalid admin settings (check the ADMIN_* environment variables):\n  - ${problems.join('\n  - ')}`
    );
  }
}

async function seedAdmin(client) {
  const { name, email, password } = config.admin;
  const passwordHash = await bcrypt.hash(password, 10);

  const { rows } = await client.query(
    `INSERT INTO users (name, email, password_hash, address, role)
     VALUES ($1, $2, $3, NULL, $4)
     ON CONFLICT (email) DO UPDATE
       SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash
     RETURNING (xmax = 0) AS created`,
    [name.trim(), email.trim().toLowerCase(), passwordHash, ROLES.ADMIN]
  );

  console.log(`Admin ${rows[0].created ? 'created' : 'updated'}: ${email}`);
}

async function insertUser(client, user, role, passwordHash) {
  await client.query(
    `INSERT INTO users (name, email, password_hash, address, role)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO NOTHING`,
    [user.name, user.email, passwordHash, user.address, role]
  );
}

async function insertStore(client, store, ownerEmail) {
  await client.query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES ($1, $2, $3, (SELECT id FROM users WHERE email = $4 AND role = 'OWNER'))
     ON CONFLICT DO NOTHING`,
    [store.name, store.email, store.address, ownerEmail]
  );
}

async function seedDemoData(client) {
  const ownerHash = await bcrypt.hash(DEMO_PASSWORDS.owner, 10);
  const userHash = await bcrypt.hash(DEMO_PASSWORDS.user, 10);

  for (const owner of OWNERS) {
    await insertUser(client, owner, ROLES.OWNER, ownerHash);
    await insertStore(client, owner.store, owner.email);
  }

  for (const store of STORES_WITHOUT_OWNER) {
    await insertStore(client, store, null);
  }

  for (const user of USERS) {
    await insertUser(client, user, ROLES.USER, userHash);
  }

  for (const [userEmail, storeEmail, rating] of RATINGS) {
    await client.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       SELECT u.id, s.id, $3
       FROM users u, stores s
       WHERE u.email = $1 AND s.email = $2
       ON CONFLICT (user_id, store_id) DO NOTHING`,
      [userEmail, storeEmail, rating]
    );
  }

  console.log(
    `Demo data ready: ${OWNERS.length} owners, ${USERS.length} users, ` +
      `${OWNERS.length + STORES_WITHOUT_OWNER.length} stores`
  );
}

async function seed() {
  checkAdminConfig();

  await withTransaction(async (client) => {
    await seedAdmin(client);

    // Demo accounts have publicly known passwords, so production skips them
    // unless SEED_DEMO_DATA=true is set (useful for a public demo).
    if (config.seedDemoData) {
      await seedDemoData(client);
    } else {
      console.log('Skipping demo data (set SEED_DEMO_DATA=true to include it)');
    }
  });
}

if (require.main === module) {
  seed()
    .catch((err) => {
      console.error(err.message);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}

module.exports = { seed };
