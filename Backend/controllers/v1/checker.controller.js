const { advanceStage, returnToUser } = require('../../service/v1/workflow.service');
const { checkerQueue } = require('../../service/v1/request.service');

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

module.exports = { queue, forward, returnRequest };