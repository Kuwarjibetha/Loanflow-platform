const { listAuditLogs } = require('../../../service/v1');

async function list(req, res, next) {
  try {
    const { requestId } = req.query;
    const logs = await listAuditLogs({ requestId });
    res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
}

module.exports = { list };
