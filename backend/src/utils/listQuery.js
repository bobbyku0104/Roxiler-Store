const { Op } = require('sequelize');

function buildWhere(query, searchFields, exactFields = []) {
  const where = {};

  for (const field of searchFields) {
    const value = query[field]?.trim();
    if (value) {
      where[field] = { [Op.iLike]: `%${value}%` };
    }
  }

  for (const field of exactFields) {
    const value = query[field]?.trim();
    if (value) {
      where[field] = value;
    }
  }

  return where;
}

function buildOrder(query, sortableFields, defaultField = 'name') {
  const field = sortableFields.includes(query.sortBy) ? query.sortBy : defaultField;
  const direction = query.order?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return { field, direction };
}

module.exports = { buildWhere, buildOrder };
