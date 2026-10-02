require('dotenv').config();

const { sequelize, User } = require('../models');

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  try {
    await sequelize.sync();

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log('Admin already exists');
      return;
    }

    await User.create({
      name: 'System Administrator Account',
      email,
      password,
      address: 'Head Office',
      role: 'admin',
    });

    console.log(`Admin created: ${email}`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seedAdmin();
