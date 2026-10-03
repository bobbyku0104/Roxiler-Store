const { literal } = require('sequelize');
const { Store, Rating } = require('../models');
const { buildWhere, buildOrder } = require('../utils/listQuery');
const { averageRatingOf } = require('../utils/rating');

async function listStores(req, res) {
  const userId = Number(req.user.id);
  const where = buildWhere(req.query, ['name', 'address']);
  const { field, direction } = buildOrder(req.query, ['name', 'address', 'rating']);

  const order =
    field === 'rating' ? [[literal(`rating ${direction} NULLS LAST`)]] : [[field, direction]];

  const stores = await Store.findAll({
    where,
    attributes: [
      'id',
      'name',
      'address',
      [averageRatingOf('"Store"."id"'), 'rating'],
      [
        literal(
          `(SELECT r.rating FROM ratings r WHERE r.store_id = "Store"."id" AND r.user_id = ${userId})`
        ),
        'myRating',
      ],
    ],
    order,
  });

  res.json({ stores });
}

async function rateStore(req, res) {
  const storeId = req.params.id;
  const userId = req.user.id;
  const { rating } = req.body;

  const store = await Store.findByPk(storeId);
  if (!store) {
    return res.status(404).json({ message: 'Store not found' });
  }

  const existing = await Rating.findOne({ where: { storeId, userId } });

  if (existing) {
    existing.rating = rating;
    await existing.save();
    return res.json({ message: 'Rating updated', rating: existing });
  }

  const created = await Rating.create({ storeId, userId, rating });
  res.status(201).json({ message: 'Rating submitted', rating: created });
}

module.exports = { listStores, rateStore };
