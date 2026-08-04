const router = require('express').Router();
const { authenticate } = require('../../middleware/auth');
const { list, markRead } = require('../../controllers/v1/notification.controller');

router.use(authenticate);

router.get('/', list);
router.patch('/:id/read', markRead);

module.exports = router;
