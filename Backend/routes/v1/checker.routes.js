const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const { dispatchToStage } = require('../../middleware/dispatcher');
const { queue, forward, returnRequest, verifyDoc } = require('../../controllers/v1/checker.controller');

router.use(authenticate, authorize('checker'));

router.get('/queue', queue);
router.post('/:id/forward', dispatchToStage, forward);
router.post('/:id/return', dispatchToStage, returnRequest);
router.patch('/:id/documents/:docId', dispatchToStage, verifyDoc);

module.exports = router;