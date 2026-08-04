const { LoanRequest, ApprovalStage } = require('../../../models');

async function approverQueue(departmentId) {
  return ApprovalStage.findAll({
    where: { role: 'approver', status: 'in_progress', departmentId },
    include: [{ model: LoanRequest }],
  });
}

module.exports = { approverQueue };
