const approverService    = require('./approver/approver.service');
const auditService       = require('./audit/audit.service');
const checkerService     = require('./checker/checker.service');
const departmentService  = require('./department/department.service');
const notificationService = require('./notification/notification.service');
const requestService     = require('./request/request.service');
const userService        = require('./user/user.service');
const workflowService    = require('./workflow/workflow.service');

// ─── Export individual service namespaces ──────────────────────────
// Use named namespaces to avoid function-name collisions across services
// (e.g. both requestService and notificationService export `listForUser`)

module.exports = {
  // ── Approver ──────────────────────────────────────────────────────
  approverQueue:         approverService.approverQueue,

  // ── Audit ─────────────────────────────────────────────────────────
  listAuditLogs:         auditService.listAuditLogs,
  logAction:             auditService.logAction,

  // ── Checker ───────────────────────────────────────────────────────
  checkerQueue:          checkerService.checkerQueue,
  verifyDocument:        checkerService.verifyDocument,

  // ── Department ────────────────────────────────────────────────────
  listDepartments:       departmentService.listDepartments,
  createDepartment:      departmentService.createDepartment,
  updateDepartment:      departmentService.updateDepartment,
  deleteDepartment:      departmentService.deleteDepartment,

  // ── Notification (namespaced to avoid clash with request's listForUser) ──
  listNotifications:     notificationService.listForUser,
  markAsRead:            notificationService.markAsRead,
  createNotification:    notificationService.createNotification,

  // ── Request ───────────────────────────────────────────────────────
  createRequest:         requestService.createRequest,
  getStatus:             requestService.getStatus,
  listRequestsForUser:   requestService.listForUser,
  listAll:               requestService.listAll,
  addDocument:           requestService.addDocument,
  resubmitRequest:       requestService.resubmitRequest,

  // ── User ──────────────────────────────────────────────────────────
  listUsers:             userService.listUsers,
  updateUser:            userService.updateUser,

  // ── Workflow ──────────────────────────────────────────────────────
  initStages:            workflowService.initStages,
  advanceStage:          workflowService.advanceStage,
  rerouteToDepartment:   workflowService.rerouteToDepartment,
  returnToUser:          workflowService.returnToUser,
  resubmit:              workflowService.resubmit,

  // ── Raw service namespaces (for direct access if needed) ──────────
  approverService,
  auditService,
  checkerService,
  departmentService,
  notificationService,
  requestService,
  userService,
  workflowService,
};
