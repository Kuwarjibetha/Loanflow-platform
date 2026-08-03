const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const { allRequests } = require('../../controllers/v1/request.controller');
const { list: listDepts, create, update: updateDept, remove } = require('../../controllers/v1/department.controller');
const { list: listUsers, update: updateUser } = require('../../controllers/v1/user.controller');

router.use(authenticate, authorize('admin'));

// Requests
router.get('/requests', allRequests);

// Department CRUD
router.get('/departments',        listDepts);
router.post('/departments',       create);
router.patch('/departments/:id',  updateDept);
router.delete('/departments/:id', remove);

// User management
router.get('/users',        listUsers);
router.patch('/users/:id',  updateUser);

module.exports = router;