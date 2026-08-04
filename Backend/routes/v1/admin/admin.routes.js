const router = require('express').Router();
const { authenticate, authorize } = require('../../../middleware');
const { requestController, departmentController, userController, auditController } = require('../../../controllers/v1');

router.use(authenticate, authorize('admin'));


router.get('/requests', requestController.allRequests); // Requests


router.get('/departments',        departmentController.list); // Department CRUD
router.post('/departments',       departmentController.create);
router.patch('/departments/:id',  departmentController.update);
router.delete('/departments/:id', departmentController.remove);


router.get('/users',        userController.list); // User management
router.patch('/users/:id',  userController.update);


router.get('/audit-logs', auditController.list); // Audit logs

module.exports = router;
