const { sequelize, LoanRequest, Document, ApprovalStage } = require('../../models');
const { initStages } = require('./workflow.service');

async function createRequest(userId, { loanType, amountRequested, documents }) {
  return sequelize.transaction(async (t) => {
    const request = await LoanRequest.create(
      { userId, loanType, amountRequested, status: 'checker_review' },
      { transaction: t }
    );

    if (documents?.length) {
      await Document.bulkCreate(
        documents.map((d) => ({ ...d, loanRequestId: request.id })),
        { transaction: t }
      );
    }

    await initStages(request, t);

    return request;
  });
}

async function getStatus(requestId, requestingUser) {
  const where = { id: requestId };
  // Regular users can only see their own requests; staff can see any.
  if (requestingUser.role === 'user') {
    where.userId = requestingUser.id;
  }
  return LoanRequest.findOne({
    where,
    include: ['stages', 'documents'],
  });
}

async function listForUser(userId) {
  return LoanRequest.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
}

async function checkerQueue() {
  return ApprovalStage.findAll({
    where: { role: 'checker', status: 'in_progress' },
    include: [{ model: LoanRequest }],
  });
}

async function approverQueue(departmentId) {
  return ApprovalStage.findAll({
    where: { role: 'approver', status: 'in_progress', departmentId },
    include: [{ model: LoanRequest }],
  });
}

async function listAll() {
  return LoanRequest.findAll({
    include: ['currentStage'],
    order: [['createdAt', 'DESC']],
  });
}

module.exports = { createRequest, getStatus, listForUser, checkerQueue, approverQueue, listAll };