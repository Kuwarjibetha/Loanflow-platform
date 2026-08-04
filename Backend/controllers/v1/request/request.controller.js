const { createRequest, getStatus, listForUser, listAll, addDocument, resubmitRequest } = require('../../../service/v1');

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

async function uploadDocument(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const doc = await addDocument(req.params.id, req.user.id, {
      docType: req.body.docType || 'general',
      filePath: req.file.path,
    });
    if (!doc) return res.status(404).json({ success: false, message: 'Request not found' });
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
}

async function resubmit(req, res, next) {
  try {
    const updated = await resubmitRequest(req.params.id, req.user.id);
    if (!updated) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = { submit, status, myRequests, allRequests, uploadDocument, resubmit };
