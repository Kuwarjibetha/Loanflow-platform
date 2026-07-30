const { LoanRequest, ApprovalStage } = require('../models');

async function dispatchToStage(req, res, next) {
  try {
    const { id } = req.params;
    const request = await LoanRequest.findByPk(id, {
      include: [{ model: ApprovalStage, as: 'currentStage' }],
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const stage = request.currentStage;
    if (!stage) {
      return res.status(409).json({ success: false, message: 'Request has no active stage' });
    }

    if (stage.role === 'checker' && req.user.role !== 'checker') {
      return res.status(403).json({ success: false, message: 'Not at checker stage' });
    }

    if (stage.role === 'approver') {
      if (req.user.role !== 'approver') {
        return res.status(403).json({ success: false, message: 'Not at approver stage' });
      }
      if (req.user.departmentId !== stage.departmentId) {
        return res.status(403).json({ success: false, message: 'Not your department' });
      }
    }

    req.loanRequest = request;
    req.currentStage = stage;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { dispatchToStage };