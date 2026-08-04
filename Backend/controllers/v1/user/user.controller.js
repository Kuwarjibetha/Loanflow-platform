const { listUsers, updateUser } = require('../../../service/v1');

async function list(req, res, next) {
  try {
    const users = await listUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    
    if (req.params.id === req.user.id && req.body.role && req.body.role !== 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot change your own role' });
    }

    const user = await updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, update };
