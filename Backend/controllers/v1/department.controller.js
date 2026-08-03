const {
  listDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../../service/v1/department.service');

async function list(req, res, next) {
  try {
    const departments = await listDepartments();
    res.json({ success: true, data: departments });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, sequenceOrder } = req.body;
    if (!name || sequenceOrder == null) {
      return res.status(400).json({ success: false, message: 'name and sequenceOrder are required' });
    }
    const dept = await createDepartment({ name, sequenceOrder: Number(sequenceOrder) });
    res.status(201).json({ success: true, data: dept });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { name, sequenceOrder } = req.body;
    const fields = {};
    if (name != null) fields.name = name;
    if (sequenceOrder != null) fields.sequenceOrder = Number(sequenceOrder);

    const dept = await updateDepartment(req.params.id, fields);
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, data: dept });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await deleteDepartment(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, message: 'Department deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove };
