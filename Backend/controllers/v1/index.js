const approverController = require('./approver/approver.controller');
const auditController = require('./audit/audit.controller');
const authController = require('./auth/auth.controller');
const checkerController = require('./checker/checker.controller');
const departmentController = require('./department/department.controller');
const notificationController = require('./notification/notification.controller');
const requestController = require('./request/request.controller');
const userController = require('./user/user.controller');

module.exports = { approverController,
  auditController, authController,
  checkerController,
  departmentController,
  notificationController,
  requestController,
  userController,
};
