const router = require('express').Router();
router.use('/auth', require('./auth.routes'));
router.use('/requests', require('./request.routes'));
router.use('/checker', require('./checker.routes'));
router.use('/approver', require('./approver.routes'));
router.use('/admin', require('./admin.routes'));
module.exports = router;