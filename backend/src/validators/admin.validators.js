const { body, query } = require('express-validator');
const { ALL_ROLES } = require('../utils/roles');
const {
  personName,
  storeName,
  email,
  address,
  password,
  idParam,
  sortOrder,
  MAX_ID,
} = require('./common.validators');

const roleMessage = `Role must be one of: ${ALL_ROLES.join(', ')}`;

const createUser = [
  personName(),
  email(),
  address(),
  password(),
  body('role').isIn(ALL_ROLES).withMessage(roleMessage),
];

const createStore = [
  storeName(),
  email(),
  address(),
  body('ownerId')
    .optional({ values: 'falsy' })
    .isInt({ min: 1, max: MAX_ID })
    .withMessage('Invalid owner')
    .toInt(),
];

const listUsers = [
  query('role').optional({ values: 'falsy' }).isIn(ALL_ROLES).withMessage(roleMessage),
  sortOrder,
];

const listStores = [sortOrder];

const userId = [idParam('id')];

module.exports = { createUser, createStore, listUsers, listStores, userId };
