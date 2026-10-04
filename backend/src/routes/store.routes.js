const router = require('express').Router();
const stores = require('../controllers/store.controller');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');
const rules = require('../validators/store.validators');

router.use(authenticate, authorize(ROLES.USER));

router.get('/', validate(rules.listStores), stores.listStores);
router.put('/:storeId/rating', validate(rules.rateStore), stores.rateStore);

module.exports = router;
