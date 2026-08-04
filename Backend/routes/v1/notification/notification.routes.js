const router = require('express').Router();
const { authenticate } = require('../../../middleware');
const { notificationController } = require('../../../controllers/v1');

router.use(authenticate);

router.get('/', notificationController.list);
router.patch('/:id/read', notificationController.markRead);

module.exports = router;
