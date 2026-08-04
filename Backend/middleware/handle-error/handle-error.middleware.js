// Error handling middleware — centralised global error handler
// (Implemented inline in app.js; extend here as needed)

function handleError(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status  = err.status || err.statusCode || 500;
  const message = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
  console.error('[error]', status, message);
  res.status(status).json({ success: false, message });
}

module.exports = { handleError };
