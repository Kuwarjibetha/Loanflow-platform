const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  role: {
    type: DataTypes.ENUM('user', 'checker', 'approver', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  },
  departmentId: { type: DataTypes.UUID, allowNull: true },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;