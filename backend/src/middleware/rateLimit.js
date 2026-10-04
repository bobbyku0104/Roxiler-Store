const rateLimit = require('express-rate-limit');

function limiter({ minutes, limit, message, skipSuccessfulRequests = false }) {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    limit,
    skipSuccessfulRequests,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message },
  });
}

// Only failed attempts count, so a user who mistypes once isn't punished.
const loginLimiter = limiter({
  minutes: 15,
  limit: 10,
  skipSuccessfulRequests: true,
  message: 'Too many failed login attempts. Please try again in 15 minutes.',
});

const signupLimiter = limiter({
  minutes: 60,
  limit: 30,
  message: 'Too many sign-up attempts from this network. Please try again later.',
});

const apiLimiter = limiter({
  minutes: 1,
  limit: 300,
  message: 'Too many requests. Please slow down.',
});

module.exports = { loginLimiter, signupLimiter, apiLimiter };
