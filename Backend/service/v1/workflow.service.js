const { sequelize, ApprovalStage, Department } = require('../../models');

// Creates the full stage chain for a new request: one checker stage,
// then one approver stage per department (ordered by sequenceOrder).
async function initStages(loanRequest, t) {
  const departments = await Department.findAll({
    order: [['sequenceOrder', 'ASC']],
    transaction: t,
  });

  const stages = [
    { loanRequestId: loanRequest.id, role: 'checker', departmentId: null, sequenceOrder: 0 },
    ...departments.map((d) => ({
      loanRequestId: loanRequest.id,
      role: 'approver',
      departmentId: d.id,
      sequenceOrder: d.sequenceOrder,
    })),
  ];

  const created = await ApprovalStage.bulkCreate(stages, { transaction: t });

  const firstStage = created.sort((a, b) => a.sequenceOrder - b.sequenceOrder)[0];
  firstStage.status = 'in_progress';
  await firstStage.save({ transaction: t });

  loanRequest.currentStageId = firstStage.id;
  await loanRequest.save({ transaction: t });

  return created;
}

// Moves a request to the next stage in sequence, or marks it fully
// approved if this was the last department.
async function advanceStage(loanRequest, currentStage, actingUser, remarks) {
  return sequelize.transaction(async (t) => {
    currentStage.status = 'approved';
    currentStage.actedByUserId = actingUser.id;
    currentStage.remarks = remarks || null;
    currentStage.actedAt = new Date();
    await currentStage.save({ transaction: t });

    const nextStage = await ApprovalStage.findOne({
      where: { loanRequestId: loanRequest.id, sequenceOrder: currentStage.sequenceOrder + 1 },
      transaction: t,
    });

    if (nextStage) {
      nextStage.status = 'in_progress';
      await nextStage.save({ transaction: t });
      loanRequest.currentStageId = nextStage.id;
      loanRequest.status = nextStage.role === 'checker' ? 'checker_review' : 'approver_review';
    } else {
      loanRequest.status = 'approved';
      loanRequest.currentStageId = null;
    }
    await loanRequest.save({ transaction: t });

    return loanRequest;
  });
}

// Reroutes an approver-stage request to a different department.
async function rerouteToDepartment(loanRequest, currentStage, targetDepartmentId, actingUser, remarks) {
  return sequelize.transaction(async (t) => {
    currentStage.status = 'skipped';
    currentStage.actedByUserId = actingUser.id;
    currentStage.remarks = remarks || null;
    currentStage.actedAt = new Date();
    await currentStage.save({ transaction: t });

    let targetStage = await ApprovalStage.findOne({
      where: { loanRequestId: loanRequest.id, departmentId: targetDepartmentId },
      transaction: t,
    });

    if (!targetStage) {
      const dept = await Department.findByPk(targetDepartmentId, { transaction: t });
      targetStage = await ApprovalStage.create({
        loanRequestId: loanRequest.id,
        role: 'approver',
        departmentId: targetDepartmentId,
        sequenceOrder: dept.sequenceOrder,
        status: 'in_progress',
      }, { transaction: t });
    } else {
      targetStage.status = 'in_progress';
      await targetStage.save({ transaction: t });
    }

    loanRequest.currentStageId = targetStage.id;
    await loanRequest.save({ transaction: t });

    return loanRequest;
  });
}

// Sends the request back to the user for correction/rejection.
async function returnToUser(loanRequest, currentStage, actingUser, remarks) {
  return sequelize.transaction(async (t) => {
    currentStage.status = 'returned';
    currentStage.actedByUserId = actingUser.id;
    currentStage.remarks = remarks;
    currentStage.actedAt = new Date();
    await currentStage.save({ transaction: t });

    loanRequest.status = 'returned_to_user';
    await loanRequest.save({ transaction: t });

    return loanRequest;
  });
}

module.exports = { initStages, advanceStage, rerouteToDepartment, returnToUser };