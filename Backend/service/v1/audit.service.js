const { AuditLog, User, LoanRequest } = require('../../models');

async function listAuditLogs(filter = {}) {
  const where = {};
  if (filter.requestId) {
    where.loanRequestId = filter.requestId;
  }
  return AuditLog.findAll({
    where,
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] },
      { model: LoanRequest, as: 'loanRequest', attributes: ['id', 'loanType', 'amountRequested', 'status'] },
    ],
    order: [['createdAt', 'DESC']],
    limit: 200,
  });
}

async function logAction(loanRequestId, userId, action, details = null, transaction = null) {
  const options = transaction ? { transaction } : {};
  return AuditLog.create({ loanRequestId, userId, action, details }, options);
}

module.exports = { listAuditLogs, logAction };
