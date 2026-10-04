const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const storeService = require('../services/store.service');
const dashboardService = require('../services/dashboard.service');

async function getDashboard(req, res) {
  res.json(await dashboardService.getTotals());
}

async function listUsers(req, res) {
  res.json({ users: await userService.listUsers(req.query) });
}

async function getUser(req, res) {
  res.json({ user: await userService.getUserById(req.params.id) });
}

async function createUser(req, res) {
  const { name, email, address, password, role } = req.body;
  const { user } = await authService.createUser({ name, email, address, password, role });
  res.status(201).json({ user });
}

async function listOwners(req, res) {
  res.json({ owners: await userService.listOwners() });
}

async function listStores(req, res) {
  res.json({ stores: await storeService.listStoresForAdmin(req.query) });
}

async function createStore(req, res) {
  const { name, email, address, ownerId } = req.body;
  const store = await storeService.createStore({ name, email, address, ownerId });
  res.status(201).json({ store });
}

module.exports = {
  getDashboard,
  listUsers,
  getUser,
  createUser,
  listOwners,
  listStores,
  createStore,
};
