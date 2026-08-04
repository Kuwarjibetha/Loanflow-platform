// Logger middleware — HTTP request logging
// Wraps morgan; extend here for custom log formats, transports, etc.
const morgan = require('morgan');

const logger = morgan('dev');

module.exports = logger;
