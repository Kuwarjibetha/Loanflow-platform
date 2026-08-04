const approverService = require('./approver/approver.service');
const auditService = require('./audit/audit.service');
const checkerService = require('./checker/checker.service');
const departmentService = require('./department/department.service');
const notificationService = require('./notification/notification.service');
const requestService = require('./request/request.service');
const userService = require('./user/user.service');
const workflowService = require('./workflow/workflow.service');

module.exports = {
  ...approverService,
  ...auditService,
  ...checkerService,
  ...departmentService,
  ...notificationService,
  ...requestService,
  ...userService,
  ...workflowService,
  approverService,
  auditService,
  checkerService,
  departmentService,
  notificationService,
  requestService,
  userService,
  workflowService,
};
