const storeService = require('../services/store.service');

async function listStores(req, res) {
  res.json({ stores: await storeService.listStoresForUser(req.user.id, req.query) });
}

async function rateStore(req, res) {
  const { created, rating } = await storeService.rateStore(
    req.user.id,
    req.params.storeId,
    req.body.rating
  );

  res.status(created ? 201 : 200).json({
    message: created ? 'Rating submitted' : 'Rating updated',
    rating,
  });
}

module.exports = { listStores, rateStore };
