const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const { submit, status, myRequests } = require('../../controllers/v1/request.controller');

router.use(authenticate);

router.post('/', authorize('user'), submit);
router.get('/', authorize('user'), myRequests);
router.get('/:id/status', authorize('user'), status);

module.exports = router;