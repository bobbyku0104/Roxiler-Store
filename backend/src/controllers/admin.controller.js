const { literal } = require('sequelize');
const { User, Store, Rating } = require('../models');
const { buildWhere, buildOrder } = require('../utils/listQuery');
const { averageRatingOf } = require('../utils/rating');

async function getDashboard(req, res) {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    User.count(),
    Store.count(),
    Rating.count(),
  ]);

  res.json({ totalUsers, totalStores, totalRatings });
}

async function createUser(req, res) {
  const { name, email, address, password, role } = req.body;

  const exists = await User.findOne({ where: { email } });
  if (exists) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  const user = await User.create({ name, email, address, password, role });
  const { password: _, ...data } = user.toJSON();

  res.status(201).json({ user: data });
}

async function listUsers(req, res) {
  const where = buildWhere(req.query, ['name', 'email', 'address'], ['role']);
  const { field, direction } = buildOrder(req.query, ['name', 'email', 'address', 'role', 'createdAt']);

  const users = await User.findAll({
    where,
    attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
    order: [[field, direction]],
  });

  res.json({ users });
}

async function getUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(404).json({ message: 'User not found' });
  }

  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const data = user.toJSON();

  if (user.role === 'owner') {
    const store = await Store.findOne({
      where: { ownerId: user.id },
      attributes: ['id', 'name', [averageRatingOf('"Store"."id"'), 'rating']],
    });
    data.store = store;
    data.rating = store ? store.get('rating') : null;
  }

  res.json({ user: data });
}

async function createStore(req, res) {
  const { name, email, address, ownerId } = req.body;

  const exists = await Store.findOne({ where: { email } });
  if (exists) {
    return res.status(409).json({ message: 'A store with this email already exists' });
  }

  if (ownerId) {
    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== 'owner') {
      return res.status(400).json({ message: 'Selected user is not a store owner' });
    }

    const ownedStore = await Store.findOne({ where: { ownerId } });
    if (ownedStore) {
      return res.status(409).json({ message: 'This owner already has a store' });
    }
  }

  const store = await Store.create({ name, email, address, ownerId: ownerId || null });

  res.status(201).json({ store });
}

async function listStores(req, res) {
  const where = buildWhere(req.query, ['name', 'email', 'address']);
  const { field, direction } = buildOrder(req.query, ['name', 'email', 'address', 'rating', 'createdAt']);

  const order =
    field === 'rating' ? [[literal(`rating ${direction} NULLS LAST`)]] : [[field, direction]];

  const stores = await Store.findAll({
    where,
    attributes: [
      'id',
      'name',
      'email',
      'address',
      'ownerId',
      'createdAt',
      [averageRatingOf('"Store"."id"'), 'rating'],
    ],
    include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
    order,
  });

  res.json({ stores });
}

module.exports = { getDashboard, createUser, listUsers, getUser, createStore, listStores };
