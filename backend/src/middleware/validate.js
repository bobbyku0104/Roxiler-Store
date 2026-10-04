const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

function validate(rules) {
  return [
    ...rules,
    (req, res, next) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        const errors = result
          .array({ onlyFirstError: true })
          .map((error) => ({ field: error.path, message: error.msg }));
        throw ApiError.badRequest('Please fix the highlighted fields', errors);
      }
      next();
    },
  ];
}

module.exports = validate;
