const { Department } = require('../../../models');

async function listDepartments() {
  return Department.findAll({ order: [['sequenceOrder', 'ASC']] });
}

async function createDepartment({ name, sequenceOrder }) {
  return Department.create({ name, sequenceOrder });
}

async function updateDepartment(id, fields) {
  const dept = await Department.findByPk(id);
  if (!dept) return null;
  Object.assign(dept, fields);
  await dept.save();
  return dept;
}

async function deleteDepartment(id) {
  const dept = await Department.findByPk(id);
  if (!dept) return null;
  await dept.destroy();
  return true;
}

module.exports = { listDepartments, createDepartment, updateDepartment, deleteDepartment };
