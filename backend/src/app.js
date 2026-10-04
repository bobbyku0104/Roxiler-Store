const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/env');
const { query } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimit');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const storeRoutes = require('./routes/store.routes');
const ownerRoutes = require('./routes/owner.routes');

const app = express();

if (config.trustProxy) {
  app.set('trust proxy', config.trustProxy);
}

app.use(helmet());
app.use(cors({ origin: config.corsOrigins }));
app.use(express.json({ limit: '10kb' }));
app.use('/api', apiLimiter);

app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', database: 'up' });
  } catch {
    res.status(503).json({ status: 'error', database: 'down' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/owner', ownerRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
