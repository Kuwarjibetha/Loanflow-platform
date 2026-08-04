const router = require('express').Router();
const { authenticate, authorize, dispatchToStage } = require('../../../middleware');
const { checkerController } = require('../../../controllers/v1');

router.use(authenticate, authorize('checker'));

router.get('/queue', checkerController.queue);
router.post('/:id/forward', dispatchToStage, checkerController.forward);
router.post('/:id/return', dispatchToStage, checkerController.returnRequest);
router.patch('/:id/documents/:docId', dispatchToStage, checkerController.updateDocumentStatus);

module.exports = router;
