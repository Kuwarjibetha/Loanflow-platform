const { LoanRequest, Document, ApprovalStage } = require('../../../models');

async function checkerQueue() {
  return ApprovalStage.findAll({
    where: { role: 'checker', status: 'in_progress' },
    include: [{ model: LoanRequest }],
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

module.exports = { checkerQueue, verifyDocument };
