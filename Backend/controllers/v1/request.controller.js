const { createRequest, getStatus, listForUser, listAll } = require('../../service/v1/request.service');

async function submit(req, res, next) {
  try {
    const request = await createRequest(req.user.id, req.body);
    res.status(201).json({ success: true, data: request });
  } catch (err) {
    next(err);
  }
}

async function status(req, res, next) {
  try {
    const request = await getStatus(req.params.id, req.user);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, data: request });
  } catch (err) {
    next(err);
  }
}

async function myRequests(req, res, next) {
  try {
    const requests = await listForUser(req.user.id);
    res.json({ success: true, data: requests });
  } catch (err) {
    next(err);
  }
}

async function allRequests(req, res, next) {
  try {
    const requests = await listAll();
    res.json({ success: true, data: requests });
  } catch (err) {
    next(err);
  }
}

module.exports = { submit, status, myRequests, allRequests };