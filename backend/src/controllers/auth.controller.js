const authService = require('../services/auth.service');

async function signup(req, res) {
  const { name, email, address, password } = req.body;
  const result = await authService.signup({ name, email, address, password });
  res.status(201).json(result);
}

async function login(req, res) {
  const result = await authService.login(req.body.email, req.body.password);
  res.json(result);
}

async function me(req, res) {
  res.json({ user: authService.toPublicUser(req.user) });
}

async function changePassword(req, res) {
  const token = await authService.changePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword
  );
  res.json({ message: 'Password updated successfully', token });
}

module.exports = { signup, login, me, changePassword };
