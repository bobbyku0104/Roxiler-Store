const router = require('express').Router();
const auth = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { signupRules, loginRules, updatePasswordRules } = require('../validators/auth.validators');

router.post('/signup', validate(signupRules), auth.signup);
router.post('/login', validate(loginRules), auth.login);
router.get('/me', authenticate, auth.me);
router.patch('/password', authenticate, validate(updatePasswordRules), auth.updatePassword);

module.exports = router;
