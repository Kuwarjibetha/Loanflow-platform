const { advanceStage, rerouteToDepartment, returnToUser } = require('../../service/v1/workflow.service');
const { approverQueue } = require('../../service/v1/request.service');

async function queue(req, res, next) {
  try {
    const stages = await approverQueue(req.user.departmentId);
    res.json({ success: true, data: stages });
  } catch (err) {
    next(err);
  }
}

async function approve(req, res, next) {
  try {
    const updated = await advanceStage(req.loanRequest, req.currentStage, req.user, req.body.remarks);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

async function reroute(req, res, next) {
  try {
    const { targetDepartmentId, remarks } = req.body;
    const updated = await rerouteToDepartment(req.loanRequest, req.currentStage, targetDepartmentId, req.user, remarks);
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

module.exports = { queue, approve, reroute, returnRequest };