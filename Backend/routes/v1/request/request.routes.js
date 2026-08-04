const router = require('express').Router();
const { authenticate, authorize, upload } = require('../../../middleware');
const { requestController } = require('../../../controllers/v1');

router.use(authenticate);

router.post('/', authorize('user'), requestController.submit);
router.get('/', authorize('user'), requestController.myRequests);
router.get('/:id/status', authorize('user', 'checker', 'approver'), requestController.status);
router.post('/:id/documents', authorize('user'), upload.single('file'), requestController.uploadDocument);
router.post('/:id/resubmit', authorize('user'), requestController.resubmit);

module.exports = router;
