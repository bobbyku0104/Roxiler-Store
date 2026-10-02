const express = require('express');
const cors = require('cors');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({ message: 'Record already exists' });
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
});

module.exports = app;
