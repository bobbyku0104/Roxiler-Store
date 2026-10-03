const router = require('express').Router();
const stores = require('../controllers/store.controller');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const { rateStoreRules } = require('../validators/store.validators');

router.use(authenticate, authorize('user'));

router.get('/', stores.listStores);
router.put('/:id/rating', validate(rateStoreRules), stores.rateStore);

module.exports = router;
