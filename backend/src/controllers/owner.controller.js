const { fn, col } = require('sequelize');
const { User, Store, Rating } = require('../models');
const { buildOrder } = require('../utils/listQuery');

async function getDashboard(req, res) {
  const store = await Store.findOne({
    where: { ownerId: req.user.id },
    attributes: ['id', 'name', 'email', 'address'],
  });

  if (!store) {
    return res.status(404).json({ message: 'No store is assigned to your account yet' });
  }

  const { field, direction } = buildOrder(
    req.query,
    ['name', 'email', 'rating', 'updatedAt'],
    'updatedAt'
  );

  const order =
    field === 'name' || field === 'email'
      ? [[{ model: User, as: 'user' }, field, direction]]
      : [[field, direction]];

  const [ratings, summary] = await Promise.all([
    Rating.findAll({
      where: { storeId: store.id },
      attributes: ['id', 'rating', 'updatedAt'],
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'address'] }],
      order,
    }),
    Rating.findOne({
      where: { storeId: store.id },
      attributes: [
        [fn('ROUND', fn('AVG', col('rating')), 1), 'averageRating'],
        [fn('COUNT', col('id')), 'totalRatings'],
      ],
      raw: true,
    }),
  ]);

  res.json({
    store,
    averageRating: summary.averageRating ? Number(summary.averageRating) : null,
    totalRatings: Number(summary.totalRatings),
    ratings,
  });
}

module.exports = { getDashboard };
