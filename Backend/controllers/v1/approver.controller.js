const { advanceStage, rerouteToDepartment, returnToUser } = require('../../service/v1/workflow.service');
const { approverQueue } = require('../../service/v1/request.service');
const { Department } = require('../../models');

async function queue(req, res, next) {
  try {
    const dept = req.user.departmentId ? await Department.findByPk(req.user.departmentId) : null;
    const stages = await approverQueue(req.user.departmentId);
    res.json({
      success: true,
      data: stages,
      department: dept ? { id: dept.id, name: dept.name } : null,
    });
  } catch (err) {
    next(err);
  }
}

async function listDepartments(req, res, next) {
  try {
    const departments = await Department.findAll({ order: [['sequenceOrder', 'ASC']] });
    res.json({ success: true, data: departments });
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

module.exports = { queue, listDepartments, approve, reroute, returnRequest };