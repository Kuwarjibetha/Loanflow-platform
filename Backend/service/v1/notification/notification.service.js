const { Notification } = require('../../../models');

async function listForUser(userId) {
  return Notification.findAll({
    where: { userId },
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit: 50,
  });
}

async function markAsRead(id, userId) {
  const notif = await Notification.findOne({ where: { id, userId } });
  if (!notif) return null;
  notif.read = true;
  await notif.save();
  return notif;
}

async function createNotification(userId, message, transaction = null) {
  const options = transaction ? { transaction } : {};
  return Notification.create({ userId, message }, options);
}

module.exports = { listForUser, markAsRead, createNotification };
