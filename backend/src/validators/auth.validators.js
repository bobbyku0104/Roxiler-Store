const { body } = require('express-validator');
const { nameRule, emailRule, addressRule, passwordRule } = require('./common');

const signupRules = [nameRule(), emailRule(), addressRule(), passwordRule()];

const loginRules = [
  emailRule(),
  body('password').notEmpty().withMessage('Password is required'),
];

const updatePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  passwordRule('newPassword'),
];

module.exports = { signupRules, loginRules, updatePasswordRules };
