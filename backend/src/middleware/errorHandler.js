const ApiError = require('../utils/ApiError');

const PG_ERRORS = {
  '23505': [409, 'A record with these details already exists'],
  '23503': [400, 'A referenced record does not exist'],
  '23514': [400, 'One of the values is not allowed'],
  '22P02': [400, 'Invalid value in request'],
};

function notFound(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    const body = { message: err.message };
    if (err.errors) body.errors = err.errors;
    return res.status(err.status).json(body);
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body is not valid JSON' });
  }

  if (PG_ERRORS[err.code]) {
    const [status, message] = PG_ERRORS[err.code];
    return res.status(status).json({ message });
  }

  console.error(err);
  res.status(500).json({ message: 'Something went wrong, please try again' });
}

module.exports = { notFound, errorHandler };
