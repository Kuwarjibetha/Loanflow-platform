
const morgan = require('morgan');// Logger middleware  HTTP request logging
                                // Wraps morgan extend here for custom log formats, transports, etc.

const logger = morgan('dev');

module.exports = logger;
