const express = require('express');
const {
  auth,
  cache,
  compression,
  cors,
  errorHandler,
  logger,
  rateLimit,
  requestTime,
  security,
  validation
} = require('../controllers/middlewareController');

const router = express.Router();

router.use((req, res, next) => {
  req.startedAt = Date.now();
  next();
});

router.get('/logger', logger);
router.get('/auth', auth);
router.get('/cache', cache);
router.get('/rate-limit', rateLimit);
router.get('/error-handler', errorHandler);
router.get('/request-time', requestTime);
router.get('/security', security);
router.get('/cors', cors);
router.get('/compression', compression);
router.get('/validation', validation);

module.exports = router;
