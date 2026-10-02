const jwt = require('jsonwebtoken');
const { User } = require('../models');

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

function toPublicUser(user) {
  const { id, name, email, address, role } = user;
  return { id, name, email, address, role };
}

async function signup(req, res) {
  const { name, email, address, password } = req.body;

  const exists = await User.findOne({ where: { email } });
  if (exists) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  const user = await User.create({ name, email, address, password, role: 'user' });

  res.status(201).json({ token: signToken(user), user: toPublicUser(user) });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.scope('withPassword').findOne({ where: { email } });
  if (!user || !(await user.checkPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ token: signToken(user), user: toPublicUser(user) });
}

async function me(req, res) {
  res.json({ user: toPublicUser(req.user) });
}

async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  const user = await User.scope('withPassword').findByPk(req.user.id);
  if (!(await user.checkPassword(currentPassword))) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password updated successfully' });
}

module.exports = { signup, login, me, updatePassword };
