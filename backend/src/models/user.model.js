const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

const ROLES = ['admin', 'user', 'owner'];

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: { args: [20, 60], msg: 'Name must be between 20 and 60 characters' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Invalid email address' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
      validate: {
        len: { args: [0, 400], msg: 'Address can be at most 400 characters' },
      },
    },
    role: {
      type: DataTypes.ENUM(...ROLES),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    tableName: 'users',
    underscored: true,
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: { attributes: { include: ['password'] } },
    },
  }
);

async function hashPassword(user) {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
}

User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);

User.prototype.checkPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

User.ROLES = ROLES;

module.exports = User;
