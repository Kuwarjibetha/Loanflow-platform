const router = require('express').Router();
const { authenticate, authorize, dispatchToStage } = require('../../../middleware');
const { approverController } = require('../../../controllers/v1');

router.use(authenticate, authorize('approver'));

router.get('/queue', approverController.queue);
router.get('/departments', approverController.listDepartments);
router.post('/:id/approve', dispatchToStage, approverController.approve);
router.post('/:id/reroute', dispatchToStage, approverController.reroute);
router.post('/:id/return', dispatchToStage, approverController.returnRequest);

module.exports = router;
