const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LoanRequest = sequelize.define('LoanRequest', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  loanType: { type: DataTypes.STRING, allowNull: false },
  amountRequested: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  status: {
    type: DataTypes.ENUM(
      'submitted', 'checker_review', 'returned_to_user',
      'approver_review', 'approved', 'rejected', 'disbursed'
    ),
    defaultValue: 'submitted',
  },
  currentStageId: { type: DataTypes.UUID, allowNull: true },
}, {
  tableName: 'loan_requests',
  timestamps: true,
});

module.exports = LoanRequest;