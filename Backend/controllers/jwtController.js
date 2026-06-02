const asyncHandler = require('../middlewares/async');
const jwtService = require('../services/jwtService');

exports.profile = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: req.user });
});

exports.dashboard = asyncHandler(async (req, res, next) => {
  const data = await jwtService.getDashboard(req.user);
  res.status(200).json({ success: true, data });
});

exports.generateToken = asyncHandler(async (req, res, next) => {
  const token = await jwtService.generateToken(req.body);
  res.status(200).json({ success: true, token });
});

exports.verifyToken = asyncHandler(async (req, res, next) => {
  const data = jwtService.verifyToken({
    bodyToken: req.body.token,
    authorization: req.headers.authorization
  });

  res.status(200).json({ success: true, data });
});

exports.refreshToken = asyncHandler(async (req, res, next) => {
  const token = jwtService.refreshToken({
    bodyToken: req.body.token,
    authorization: req.headers.authorization
  });

  res.status(200).json({ success: true, token });
});

exports.revokeToken = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Token revoked on client; stateless JWT cannot be server-revoked without a denylist'
  });
});

exports.privateLaws = asyncHandler(async (req, res, next) => {
  const laws = await jwtService.getPrivateLaws();
  res.status(200).json({ success: true, count: laws.length, data: laws });
});

exports.privateAnalytics = asyncHandler(async (req, res, next) => {
  const data = await jwtService.getPrivateAnalytics();
  res.status(200).json({ success: true, data });
});
