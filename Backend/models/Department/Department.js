const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db/db');

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  sequenceOrder: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'departments',
  timestamps: true,
});

module.exports = Department;
