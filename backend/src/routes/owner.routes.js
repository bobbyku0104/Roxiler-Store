const router = require('express').Router();
const owner = require('../controllers/owner.controller');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');
const { sortOrder } = require('../validators/common.validators');

router.use(authenticate, authorize(ROLES.OWNER));

router.get('/dashboard', validate([sortOrder]), owner.getDashboard);

module.exports = router;
