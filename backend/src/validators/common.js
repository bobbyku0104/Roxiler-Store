const { body } = require('express-validator');

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

const nameRule = (field = 'name') =>
  body(field)
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters');

const emailRule = (field = 'email') =>
  body(field).trim().isEmail().withMessage('Invalid email address').toLowerCase();

const addressRule = (field = 'address') =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 400 })
    .withMessage('Address can be at most 400 characters');

const passwordRule = (field = 'password') =>
  body(field)
    .matches(PASSWORD_REGEX)
    .withMessage(
      'Password must be 8-16 characters with at least one uppercase letter and one special character'
    );

module.exports = { nameRule, emailRule, addressRule, passwordRule };
