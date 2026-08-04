require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { sequelize } = require('./models');

const app = express();

// ─── Core Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ─── Static Frontend ────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── Health Check ───────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));

// ─── API Routes ─────────────────────────────────────────────────────
app.use('/api/v1', require('./routes/v1'));

// ─── Global Error Handler ───────────────────────────────────────────
// Must have 4 args so Express treats it as error middleware.
// multer-storage-cloudinary throws plain objects, so normalise both.
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status  = err.status || err.statusCode || 500;
  const message = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
  console.error('[error]', status, message);
  res.status(status).json({ success: false, message });
});

// ─── Process Crash Guards ───────────────────────────────────────────
// Prevent silent process exits on unhandled async errors (Node ≥ 15 exits by default)
process.on('unhandledRejection', (reason, promise) => {
  console.error('[unhandledRejection]', reason);
  // Do NOT exit — log and continue running
});

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err.message, err.stack);
  // Do NOT exit on non-fatal exceptions
});

// Graceful shutdown on SIGTERM (used by process managers like PM2)
process.on('SIGTERM', () => {
  console.log('[shutdown] SIGTERM received — closing server…');
  process.exit(0);
});

// ─── Server Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

async function start() {
  await sequelize.authenticate();
  console.log('Database connected');

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Keep server reference alive and handle listen errors
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