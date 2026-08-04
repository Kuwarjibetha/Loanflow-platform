const { advanceStage, returnToUser, checkerQueue, verifyDocument } = require('../../../service/v1');

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

async function updateDocumentStatus(req, res, next) {
  try {
    const { docId } = req.params;
    const { verificationStatus, invalidReason } = req.body;

    if (verificationStatus === 'invalid' && (!invalidReason || !invalidReason.trim())) {
      return res.status(400).json({
        success: false,
        message: 'invalidReason is required when verificationStatus is invalid',
      });
    }

    const updated = await verifyDocument(docId, { verificationStatus, invalidReason });
    if (!updated) return res.status(404).json({ success: false, message: 'Document not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = { queue, forward, returnRequest, updateDocumentStatus };
