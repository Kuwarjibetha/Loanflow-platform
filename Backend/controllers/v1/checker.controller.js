const { advanceStage, returnToUser } = require('../../service/v1/workflow.service');
const { checkerQueue, verifyDocument } = require('../../service/v1/request.service');

async function queue(req, res, next) {
  try {
    const stages = await checkerQueue();
    res.json({ success: true, data: stages });
  } catch (err) {
    next(err);
  }
}

async function forward(req, res, next) {
  try {
    const updated = await advanceStage(req.loanRequest, req.currentStage, req.user, req.body.remarks);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

async function returnRequest(req, res, next) {
  try {
    const updated = await returnToUser(req.loanRequest, req.currentStage, req.user, req.body.remarks);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

async function verifyDoc(req, res, next) {
  try {
    const { verificationStatus, invalidReason } = req.body;

    if (!['verified', 'invalid', 'pending'].includes(verificationStatus)) {
      return res.status(400).json({ success: false, message: 'verificationStatus must be verified, invalid, or pending' });
    }
    if (verificationStatus === 'invalid' && !invalidReason?.trim()) {
      return res.status(400).json({ success: false, message: 'invalidReason is required when marking a document invalid' });
    }

    const doc = await verifyDocument(req.params.docId, { verificationStatus, invalidReason });
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
}

module.exports = { queue, forward, returnRequest, verifyDoc };