const { body } = require('express-validator');
const { nameRule, emailRule, addressRule, passwordRule } = require('./common');
const { User } = require('../models');

const createUserRules = [
  nameRule(),
  emailRule(),
  addressRule(),
  passwordRule(),
  body('role').isIn(User.ROLES).withMessage(`Role must be one of: ${User.ROLES.join(', ')}`),
];

const createStoreRules = [
  nameRule(),
  emailRule(),
  addressRule(),
  body('ownerId').optional({ values: 'falsy' }).isInt({ min: 1 }).withMessage('Invalid owner').toInt(),
];

module.exports = { createUserRules, createStoreRules };
