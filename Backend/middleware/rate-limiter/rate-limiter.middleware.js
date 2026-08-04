// Rate Limiter middleware — prevents brute force & abuse
// Extend with express-rate-limit or similar as needed.

function rateLimiter(req, res, next) {
  // TODO: plug in express-rate-limit here
  next();
}

module.exports = rateLimiter;
