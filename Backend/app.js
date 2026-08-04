require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { sequelize } = require('./models');

const app = express();

// server startup config
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));
app.use('/api/v1', require('./routes/v1'));

app.use((err, req, res, next) => {
  const status  = err.status || err.statusCode || 500;
  const message = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
  console.error('[error]', status, message);
  res.status(status).json({ success: false, message });
});

process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err.message, err.stack);
});

process.on('SIGTERM', () => {
  console.log('[shutdown] SIGTERM received — closing server…');
  process.exit(0);
});

const PORT = process.env.PORT || 3000;

async function start() {
  await sequelize.authenticate();
  console.log('Database connected');

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[error] Port ${PORT} is already in use.`);
    } else {
      console.error('[server error]', err.message);
    }
    process.exit(1);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});