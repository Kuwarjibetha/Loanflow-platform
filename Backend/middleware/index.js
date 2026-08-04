const authMiddleware = require('./auth/auth.middleware');
const dispatcherMiddleware = require('./dispatcher/dispatcher.middleware');
const uploadMiddleware = require('./upload/upload.middleware');
const { handleError } = require('./handle-error/handle-error.middleware');
const logger = require('./logger/logger.middleware');
const rateLimiter = require('./rate-limiter/rate-limiter.middleware');
const { validate } = require('./validator/validator.middleware');

module.exports = 
{...authMiddleware,...dispatcherMiddleware,upload: uploadMiddleware,handleError,logger,rateLimiter,validate};
