const { User, Department } = require('../../../models');

const VALID_ROLES = ['user', 'checker', 'approver', 'admin'];

async function listUsers() {
  // Include department name so the frontend can show it without a second fetch
  return User.findAll({
    attributes: ['id', 'name', 'email', 'role', 'departmentId', 'createdAt'],
    include: [{ model: Department, as: 'department', attributes: ['id', 'name'], required: false }],
    order: [['createdAt', 'ASC']],
  });
}

async function updateUser(id, { role, departmentId }) {
  const user = await User.findByPk(id);
  if (!user) return null;

  if (role !== undefined) {
    if (!VALID_ROLES.includes(role)) {
      const err = new Error(`role must be one of: ${VALID_ROLES.join(', ')}`);
      err.status = 400;
      throw err;
    }
    user.role = role;
  }

  // departmentId is only meaningful for checker/approver; clear it for other roles
  if (departmentId !== undefined) {
    user.departmentId = departmentId || null;
  }
  if (role && !['checker', 'approver'].includes(user.role)) {
    user.departmentId = null;
  }

  await user.save();
  return user;
}

module.exports = { listUsers, updateUser };
