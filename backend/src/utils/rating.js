const { literal } = require('sequelize');

function averageRatingOf(storeIdColumn) {
  return literal(
    `(SELECT ROUND(AVG(r.rating)::numeric, 1)::float FROM ratings r WHERE r.store_id = ${storeIdColumn})`
  );
}

module.exports = { averageRatingOf };
