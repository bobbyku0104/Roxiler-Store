const router = require('express').Router();
const admin = require('../controllers/admin.controller');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const { createUserRules, createStoreRules } = require('../validators/admin.validators');

router.use(authenticate, authorize('admin'));

router.get('/dashboard', admin.getDashboard);

router.get('/users', admin.listUsers);
router.post('/users', validate(createUserRules), admin.createUser);
router.get('/users/:id', admin.getUser);

router.get('/stores', admin.listStores);
router.post('/stores', validate(createStoreRules), admin.createStore);

module.exports = router;
