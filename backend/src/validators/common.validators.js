const { body, param, query } = require('express-validator');
const {
  NAME_MIN,
  NAME_MAX,
  STORE_NAME_MAX,
  ADDRESS_MAX,
  PASSWORD_REGEX,
  MESSAGES,
} = require('../utils/rules');

const personName = (field = 'name') =>
  body(field)
    .isString()
    .withMessage(MESSAGES.name)
    .bail()
    .trim()
    .isLength({ min: NAME_MIN, max: NAME_MAX })
    .withMessage(MESSAGES.name);

const storeName = (field = 'name') =>
  body(field)
    .isString()
    .withMessage(MESSAGES.storeName)
    .bail()
    .trim()
    .isLength({ min: 1, max: STORE_NAME_MAX })
    .withMessage(MESSAGES.storeName);

const email = (field = 'email') =>
  body(field)
    .isString()
    .withMessage(MESSAGES.email)
    .bail()
    .trim()
    .isEmail()
    .withMessage(MESSAGES.email)
    .bail()
    .toLowerCase();

const address = (field = 'address') =>
  body(field)
    .optional({ values: 'null' })
    .isString()
    .withMessage(MESSAGES.address)
    .bail()
    .trim()
    .isLength({ max: ADDRESS_MAX })
    .withMessage(MESSAGES.address);

const password = (field = 'password') =>
  body(field).isString().withMessage(MESSAGES.password).bail().matches(PASSWORD_REGEX).withMessage(MESSAGES.password);

// Upper bound is PostgreSQL's INTEGER max, so huge ids get a 400 instead of a DB error.
const MAX_ID = 2147483647;

const idParam = (field) => param(field).isInt({ min: 1, max: MAX_ID }).withMessage('Invalid id').toInt();

const sortOrder = query('order')
  .optional()
  .isIn(['asc', 'desc'])
  .withMessage('order must be asc or desc');

module.exports = { personName, storeName, email, address, password, idParam, sortOrder, MAX_ID };
