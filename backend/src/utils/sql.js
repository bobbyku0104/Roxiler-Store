function escapeLike(value) {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

// Collects WHERE conditions and their positional parameters.
class Filters {
  constructor(params = []) {
    this.params = params;
    this.conditions = [];
  }

  contains(column, value) {
    const term = typeof value === 'string' ? value.trim() : '';
    if (term) {
      this.params.push(`%${escapeLike(term)}%`);
      this.conditions.push(`${column} ILIKE $${this.params.length} ESCAPE '\\'`);
    }
    return this;
  }

  equals(column, value) {
    if (value !== undefined && value !== null && value !== '') {
      this.params.push(value);
      this.conditions.push(`${column} = $${this.params.length}`);
    }
    return this;
  }

  where(baseCondition) {
    const all = baseCondition ? [baseCondition, ...this.conditions] : this.conditions;
    return all.length ? `WHERE ${all.join(' AND ')}` : '';
  }
}

// sortMap maps the public sortBy value to a fixed SQL expression,
// so nothing from the query string ever reaches ORDER BY.
function orderBy(query, sortMap, { defaultSort, defaultOrder = 'asc', tieBreaker }) {
  const key = Object.hasOwn(sortMap, query.sortBy) ? query.sortBy : defaultSort;
  const order = query.order === 'asc' || query.order === 'desc' ? query.order : defaultOrder;
  const direction = order === 'desc' ? 'DESC' : 'ASC';

  return `ORDER BY ${sortMap[key]} ${direction} NULLS LAST, ${tieBreaker} ASC`;
}

module.exports = { Filters, orderBy, escapeLike };
