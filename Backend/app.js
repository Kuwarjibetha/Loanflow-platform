require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));

app.use('/api/v1', require('./routes/v1'));

const PORT = process.env.PORT || 3000;

// Global JSON error handler — must have 4 args so Express treats it as error middleware.
// multer-storage-cloudinary throws plain objects, not Error instances, so normalise both.
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status  = err.status || err.statusCode || 500;
  const message = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
  console.error('[error]', status, message);
  res.status(status).json({ success: false, message });
});

async function start() {
  await sequelize.authenticate();
  console.log('Database connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});