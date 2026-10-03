const router = require('express').Router();
const owner = require('../controllers/owner.controller');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate, authorize('owner'));

router.get('/dashboard', owner.getDashboard);

module.exports = router;
