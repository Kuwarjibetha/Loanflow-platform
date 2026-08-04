const sequelize = require('../config/db');
const User = require('./User');
const Department = require('./Department');
const LoanRequest = require('./LoanRequest');
const ApprovalStage = require('./ApprovalStage');
const Document = require('./Document');
const AuditLog = require('./AuditLog');
const Notification = require('./Notification');

// --- Associations ---
User.hasMany(LoanRequest, { foreignKey: 'userId', as: 'requests' });
LoanRequest.belongsTo(User, { foreignKey: 'userId', as: 'applicant' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId' });

LoanRequest.hasMany(ApprovalStage, { foreignKey: 'loanRequestId', as: 'stages' });
ApprovalStage.belongsTo(LoanRequest, { foreignKey: 'loanRequestId' });

LoanRequest.belongsTo(ApprovalStage, { foreignKey: 'currentStageId', as: 'currentStage', constraints: false });

Department.hasMany(ApprovalStage, { foreignKey: 'departmentId', as: 'stages' });
ApprovalStage.belongsTo(Department, { foreignKey: 'departmentId' });

// Users can belong to a department (checker/approver roles)
User.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Department.hasMany(User, { foreignKey: 'departmentId', as: 'members' });

ApprovalStage.belongsTo(User, { foreignKey: 'actedByUserId', as: 'actedBy' });

LoanRequest.hasMany(Document, { foreignKey: 'loanRequestId', as: 'documents' });
Document.belongsTo(LoanRequest, { foreignKey: 'loanRequestId' });

LoanRequest.hasMany(AuditLog, { foreignKey: 'loanRequestId', as: 'auditLogs' });
AuditLog.belongsTo(LoanRequest, { foreignKey: 'loanRequestId', as: 'loanRequest' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, User, Department, LoanRequest, ApprovalStage, Document, AuditLog, Notification };