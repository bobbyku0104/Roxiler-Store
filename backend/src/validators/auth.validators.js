const { body } = require('express-validator');
const { personName, email, address, password } = require('./common.validators');

const signup = [personName(), email(), address(), password()];

const login = [
  email(),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

const changePassword = [
  body('currentPassword').isString().notEmpty().withMessage('Current password is required'),
  password('newPassword'),
];

module.exports = { signup, login, changePassword };
