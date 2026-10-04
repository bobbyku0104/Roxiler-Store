const router = require('express').Router();
const admin = require('../controllers/admin.controller');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');
const rules = require('../validators/admin.validators');

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/dashboard', admin.getDashboard);

router.get('/users', validate(rules.listUsers), admin.listUsers);
router.post('/users', validate(rules.createUser), admin.createUser);
router.get('/users/:id', validate(rules.userId), admin.getUser);

router.get('/owners', admin.listOwners);

router.get('/stores', validate(rules.listStores), admin.listStores);
router.post('/stores', validate(rules.createStore), admin.createStore);

module.exports = router;
