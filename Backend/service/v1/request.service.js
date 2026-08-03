const { sequelize, LoanRequest, Document, ApprovalStage } = require('../../models');
const { initStages, resubmit } = require('./workflow.service');

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
  if (requestingUser.role === 'user') {
    where.userId = requestingUser.id;
  }
  return LoanRequest.findOne({
    where,
    include: [
      { model: ApprovalStage, as: 'stages' },
      { model: Document, as: 'documents' },
    ],
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

async function addDocument(requestId, userId, { docType, filePath }) {
  const request = await LoanRequest.findOne({ where: { id: requestId, userId } });
  if (!request) return null;
  return Document.create({
    loanRequestId: requestId,
    docType,
    filePath,
    verificationStatus: 'pending',
  });
}

async function verifyDocument(docId, { verificationStatus, invalidReason }) {
  const doc = await Document.findByPk(docId);
  if (!doc) return null;
  doc.verificationStatus = verificationStatus;
  doc.invalidReason = verificationStatus === 'invalid' ? invalidReason : null;
  await doc.save();
  return doc;
}

// User resubmits their own returned request. currentStageId still points
// at the stage that returned it, so we just fetch that stage and hand it
// to the workflow engine's resubmit() function.
async function resubmitRequest(requestId, userId) {
  const request = await LoanRequest.findOne({
    where: { id: requestId, userId },
    include: [{ model: ApprovalStage, as: 'currentStage' }],
  });
  if (!request) return null;

  if (request.status !== 'returned_to_user') {
    const err = new Error('Request is not in a returned state');
    err.status = 409;
    throw err;
  }

  return resubmit(request, request.currentStage);
}

module.exports = {
  createRequest, getStatus, listForUser, checkerQueue, approverQueue, listAll,
  addDocument, verifyDocument, resubmitRequest,
};