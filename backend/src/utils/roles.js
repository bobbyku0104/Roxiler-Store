const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
  OWNER: 'OWNER',
});

const ALL_ROLES = Object.values(ROLES);

module.exports = { ROLES, ALL_ROLES };
