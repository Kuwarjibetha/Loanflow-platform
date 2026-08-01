const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const { allRequests } = require('../../controllers/v1/request.controller');

router.use(authenticate, authorize('admin'));

router.get('/requests', allRequests);

module.exports = router;