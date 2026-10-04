const { body } = require('express-validator');
const { idParam, sortOrder } = require('./common.validators');

const listStores = [sortOrder];

const rateStore = [
  idParam('storeId'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be a whole number from 1 to 5')
    .toInt(),
];

module.exports = { listStores, rateStore };
