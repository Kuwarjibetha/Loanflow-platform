require('dotenv').config();
const { sequelize, Department } = require('./models');

async function seed() {
  await sequelize.authenticate();

  await Department.bulkCreate([
    { name: 'DPO', sequenceOrder: 1 },
    { name: 'Finance', sequenceOrder: 2 },
    { name: 'Education Board', sequenceOrder: 3 },
  ]);

  console.log(' Departments seeded');
  process.exit(0);
}

seed().catch((err) => {
  console.error(' Seed failed:', err.message);
  process.exit(1);
});