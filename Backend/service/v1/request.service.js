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

// Adds an uploaded document to a request. filePath is the Cloudinary URL,
// already uploaded by the time this runs (multer-storage-cloudinary handles that).
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

// Checker marks a specific document valid or invalid.
async function verifyDocument(docId, { verificationStatus, invalidReason }) {
  const doc = await Document.findByPk(docId);
  if (!doc) return null;

  doc.verificationStatus = verificationStatus;
  doc.invalidReason = verificationStatus === 'invalid' ? invalidReason : null;
  await doc.save();
  return doc;
}

module.exports = {
  createRequest, getStatus, listForUser, checkerQueue, approverQueue, listAll,
  addDocument, verifyDocument,
};