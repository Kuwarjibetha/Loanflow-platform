const approverService = require('./approver/approver.service');
const auditService = require('./audit/audit.service');
const checkerService = require('./checker/checker.service');
const departmentService = require('./department/department.service');
const notificationService = require('./notification/notification.service');
const requestService = require('./request/request.service');
const userService = require('./user/user.service');
const approverService = require('./approver/approver.service');
const auditService = require('./audit/audit.service');
const checkerService = require('./checker/checker.service');
const departmentService = require('./department/department.service');
const notificationService = require('./notification/notification.service');
const requestService = require('./request/request.service');
const userService = require('./user/user.service');
const workflowService = require('./workflow/workflow.service');

// service exports
module.exports = {
  approverQueue: approverService.approverQueue,
  listAuditLogs: auditService.listAuditLogs,
  logAction: auditService.logAction,
  checkerQueue: checkerService.checkerQueue,
  verifyDocument: checkerService.verifyDocument,
  listDepartments: departmentService.listDepartments,
  createDepartment: departmentService.createDepartment,
  updateDepartment: departmentService.updateDepartment,
  deleteDepartment: departmentService.deleteDepartment,
  listNotifications: notificationService.listForUser,
  markAsRead: notificationService.markAsRead,
  createNotification: notificationService.createNotification,
  createRequest: requestService.createRequest,
  getStatus: requestService.getStatus,
  listRequestsForUser: requestService.listForUser,
  listAll: requestService.listAll,
  addDocument: requestService.addDocument,
  resubmitRequest: requestService.resubmitRequest,
  listUsers: userService.listUsers,
  updateUser: userService.updateUser,
  initStages: workflowService.initStages,
  advanceStage: workflowService.advanceStage,
  rerouteToDepartment: workflowService.rerouteToDepartment,
  returnToUser: workflowService.returnToUser,
  resubmit: workflowService.resubmit,
  approverService,
  auditService,
  checkerService,
  departmentService,
  notificationService,
  requestService,
  userService,
  workflowService,
};
