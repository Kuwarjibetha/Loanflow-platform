const { sequelize, ApprovalStage, Department } = require('../../models');
const { createNotification } = require('./notification.service');
const { logAction } = require('./audit.service');

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

  await createNotification(
    loanRequest.userId,
    `Your ${loanRequest.loanType} loan request (₹${loanRequest.amountRequested}) has been submitted and sent for checker review.`,
    t
  );

  await logAction(
    loanRequest.id,
    loanRequest.userId,
    'REQUEST_CREATED',
    { loanType: loanRequest.loanType, amountRequested: loanRequest.amountRequested },
    t
  );

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

      let deptName = '';
      if (nextStage.departmentId) {
        const dept = await Department.findByPk(nextStage.departmentId, { transaction: t });
        if (dept) deptName = ` (${dept.name})`;
      }
      await createNotification(
        loanRequest.userId,
        `Your ${loanRequest.loanType} loan request has been forwarded to ${nextStage.role}${deptName}.`,
        t
      );
      await logAction(
        loanRequest.id,
        actingUser.id,
        'STAGE_FORWARDED',
        { stageRole: currentStage.role, remarks: remarks || null },
        t
      );
    } else {
      loanRequest.status = 'approved';
      loanRequest.currentStageId = null;
      await createNotification(
        loanRequest.userId,
        `Congratulations! Your ${loanRequest.loanType} loan request of ₹${loanRequest.amountRequested} has been fully approved!`,
        t
      );
      await logAction(
        loanRequest.id,
        actingUser.id,
        'REQUEST_APPROVED',
        { remarks: remarks || null },
        t
      );
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

    const targetDept = await Department.findByPk(targetDepartmentId, { transaction: t });
    const targetDeptName = targetDept ? ` (${targetDept.name})` : '';

    await createNotification(
      loanRequest.userId,
      `Your ${loanRequest.loanType} loan request was rerouted to ${targetDeptName || 'another department'}.`,
      t
    );

    await logAction(
      loanRequest.id,
      actingUser.id,
      'STAGE_REROUTED',
      { targetDepartmentId, remarks: remarks || null },
      t
    );

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

    await createNotification(
      loanRequest.userId,
      `Your ${loanRequest.loanType} loan request was returned to you. Remarks: "${remarks}".`,
      t
    );

    await logAction(
      loanRequest.id,
      actingUser.id,
      'REQUEST_RETURNED',
      { remarks },
      t
    );

    return loanRequest;
  });
}

// User resubmits a returned request. Re-activates the exact stage that
// returned it (checker or a specific department's approver) rather than
// restarting the whole chain - whoever flagged the issue reviews it again.
async function resubmit(loanRequest, currentStage) {
  if (currentStage.status !== 'returned') {
    const err = new Error('Only returned requests can be resubmitted');
    err.status = 409;
    throw err;
  }

  return sequelize.transaction(async (t) => {
    currentStage.status = 'in_progress';
    currentStage.actedByUserId = null;
    currentStage.remarks = null;
    currentStage.actedAt = null;
    await currentStage.save({ transaction: t });

    loanRequest.status = currentStage.role === 'checker' ? 'checker_review' : 'approver_review';
    await loanRequest.save({ transaction: t });

    await createNotification(
      loanRequest.userId,
      `Your ${loanRequest.loanType} loan request has been resubmitted for review.`,
      t
    );

    await logAction(
      loanRequest.id,
      loanRequest.userId,
      'REQUEST_RESUBMITTED',
      {},
      t
    );

    return loanRequest;
  });
}

module.exports = { initStages, advanceStage, rerouteToDepartment, returnToUser, resubmit };