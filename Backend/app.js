require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));

app.use('/api/v1', require('./routes/v1'));

const PORT = process.env.PORT || 3000;

async function start() {
  await sequelize.authenticate();
  console.log('Database connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});