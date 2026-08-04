const router = require('express').Router();

router.use('/auth',          require('./auth/auth.routes'));
router.use('/requests',      require('./request/request.routes'));
router.use('/checker',       require('./checker/checker.routes'));
router.use('/approver',      require('./approver/approver.routes'));
router.use('/admin',         require('./admin/admin.routes'));
router.use('/notifications', require('./notification/notification.routes'));

module.exports = router;