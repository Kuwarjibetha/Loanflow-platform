const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const { dispatchToStage } = require('../../middleware/dispatcher');
const { queue, approve, reroute, returnRequest } = require('../../controllers/v1/approver.controller');

router.use(authenticate, authorize('approver'));

router.get('/queue', queue);
router.post('/:id/approve', dispatchToStage, approve);
router.post('/:id/reroute', dispatchToStage, reroute);
router.post('/:id/return', dispatchToStage, returnRequest);

module.exports = router;