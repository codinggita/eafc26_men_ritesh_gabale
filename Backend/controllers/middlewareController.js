const asyncHandler = require('../middlewares/async');

const ok = name => asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    middleware: name,
    requestId: req.headers['x-request-id'] || null,
    timestamp: new Date().toISOString()
  });
});

exports.logger = ok('logger');
exports.auth = ok('auth');
exports.cache = ok('cache');
exports.rateLimit = ok('rate-limit');
exports.errorHandler = ok('error-handler');
exports.requestTime = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    middleware: 'request-time',
    durationMs: Date.now() - req.startedAt
  });
});
exports.security = ok('security');
exports.cors = ok('cors');
exports.compression = ok('compression');
exports.validation = ok('validation');
