const sequelize = require('../config/db');
const User = require('./user.model');
const Store = require('./store.model');
const Rating = require('./rating.model');

User.hasOne(Store, { foreignKey: 'ownerId', as: 'store', onDelete: 'SET NULL' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings', onDelete: 'CASCADE' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

module.exports = { sequelize, User, Store, Rating };
