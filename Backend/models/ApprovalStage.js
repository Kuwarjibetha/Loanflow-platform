const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ApprovalStage = sequelize.define('ApprovalStage', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  loanRequestId: { type: DataTypes.UUID, allowNull: false },
  role: { type: DataTypes.ENUM('checker', 'approver'), allowNull: false },
  departmentId: { type: DataTypes.UUID, allowNull: true },
  sequenceOrder: { type: DataTypes.INTEGER, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'approved', 'returned', 'skipped'),
    defaultValue: 'pending',
  },
  actedByUserId: { type: DataTypes.UUID, allowNull: true },
  remarks: { type: DataTypes.TEXT, allowNull: true },
  actedAt: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'approval_stages',
  timestamps: true,
});

module.exports = ApprovalStage;