const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    loanRequestId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    action: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.JSON, allowNull: true },
}, {
    tableName: 'audit_logs',
    timestamps: true,
    updatedAt: false,
});

module.exports = AuditLog;