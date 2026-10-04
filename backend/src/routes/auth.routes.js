const router = require('express').Router();
const auth = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { loginLimiter, signupLimiter } = require('../middleware/rateLimit');
const rules = require('../validators/auth.validators');

router.post('/signup', signupLimiter, validate(rules.signup), auth.signup);
router.post('/login', loginLimiter, validate(rules.login), auth.login);
router.get('/me', authenticate, auth.me);
router.put('/password', authenticate, validate(rules.changePassword), auth.changePassword);

module.exports = router;
