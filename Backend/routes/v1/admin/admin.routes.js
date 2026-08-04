const router = require('express').Router();
const { authenticate, authorize } = require('../../../middleware');
const { requestController, departmentController, userController, auditController } = require('../../../controllers/v1');

router.use(authenticate, authorize('admin'));

// Requests
router.get('/requests', requestController.allRequests);

// Department CRUD
router.get('/departments',        departmentController.list);
router.post('/departments',       departmentController.create);
router.patch('/departments/:id',  departmentController.update);
router.delete('/departments/:id', departmentController.remove);

// User management
router.get('/users',        userController.list);
router.patch('/users/:id',  userController.update);

// Audit logs
router.get('/audit-logs', auditController.list);

module.exports = router;
