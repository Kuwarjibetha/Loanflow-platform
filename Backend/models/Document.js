const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Document = sequelize.define('Document', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  loanRequestId: { type: DataTypes.UUID, allowNull: false },
  docType: { type: DataTypes.STRING, allowNull: false },
  filePath: { type: DataTypes.STRING, allowNull: false },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'verified', 'invalid'),
    defaultValue: 'pending',
  },
  invalidReason: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'documents',
  timestamps: true,
});

module.exports = Document;