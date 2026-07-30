const { sequelize } = require('./models');

sequelize.sync({ alter: true })
  .then(() => console.log('✅ Tables synced'))
  .catch((err) => console.error('❌ Sync failed:', err.message));