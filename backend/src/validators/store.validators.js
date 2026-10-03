const { body, param } = require('express-validator');

const rateStoreRules = [
  param('id').isInt({ min: 1 }).withMessage('Invalid store id').toInt(),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5').toInt(),
];

module.exports = { rateStoreRules };
