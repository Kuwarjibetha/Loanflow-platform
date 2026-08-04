const { listForUser, markAsRead } = require('../../../service/v1');

async function list(req, res, next) {
  try {
    const notifications = await listForUser(req.user.id);
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const notif = await markAsRead(req.params.id, req.user.id);
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, data: notif });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, markRead };
