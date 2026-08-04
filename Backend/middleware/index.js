const authMiddleware = require('./auth/auth.middleware');
const dispatcherMiddleware = require('./dispatcher/dispatcher.middleware');
const uploadMiddleware = require('./upload/upload.middleware');
const { handleError } = require('./handle-error/handle-error.middleware');
const logger = require('./logger/logger.middleware');
const rateLimiter = require('./rate-limiter/rate-limiter.middleware');
const { validate } = require('./validator/validator.middleware');

module.exports = {
  // Auth
  ...authMiddleware,           // authenticate, authorize
  // Dispatcher
  ...dispatcherMiddleware,     // dispatchToStage
  // Upload
  upload: uploadMiddleware,    // multer + cloudinary
  // Handle Error
  handleError,
  // Logger
  logger,
  // Rate Limiter
  rateLimiter,
  // Validator
  validate,
};
