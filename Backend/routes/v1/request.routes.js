const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const { submit, status, myRequests, uploadDocument, resubmit } = require('../../controllers/v1/request.controller');

router.use(authenticate);

router.post('/', authorize('user'), submit);
router.get('/', authorize('user'), myRequests);
router.get('/:id/status', authorize('user', 'checker', 'approver'), status);
router.post('/:id/documents', authorize('user'), upload.single('file'), uploadDocument);
router.post('/:id/resubmit', authorize('user'), resubmit);

module.exports = router;