const ownerService = require('../services/owner.service');

async function getDashboard(req, res) {
  res.json(await ownerService.getDashboard(req.user.id, req.query));
}

module.exports = { getDashboard };
