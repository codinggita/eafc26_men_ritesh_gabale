const asyncHandler = require('../middlewares/async');
const authService = require('../services/authService');

const sendTokenResponse = (user, statusCode, res) => {
  const token = authService.issueToken(user);
  res.status(statusCode).json({ success: true, token });
};

exports.register = asyncHandler(async (req, res, next) => {
  const user = await authService.register(req.body);
  sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await authService.login({
    email: req.body.email,
    password: req.body.password,
    userAgent: req.get('user-agent'),
    ip: req.ip
  });

  sendTokenResponse(user, 200, res);
});

exports.logout = asyncHandler(async (req, res, next) => {
  await authService.logout(req.user);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json({ success: true, data: user });
});

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const user = await authService.updateDetails(req.user.id, {
    name: req.body.name,
    email: req.body.email
  });

  res.status(200).json({ success: true, data: user });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await authService.updatePassword({
    userId: req.user.id,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword
  });

  sendTokenResponse(user, 200, res);
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const resetCode = await authService.forgotPassword({
    user: req.user,
    email: req.body.email
  });

  res.status(200).json({
    success: true,
    message: 'Password reset code generated',
    resetCode
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await authService.resetPassword(req.body);
  sendTokenResponse(user, 200, res);
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
  await authService.verifyEmail({
    user: req.user,
    email: req.body.email
  });

  res.status(200).json({ success: true, message: 'Email verified' });
});

exports.sendOtp = asyncHandler(async (req, res, next) => {
  const otp = await authService.sendOtp({
    user: req.user,
    email: req.body.email
  });

  res.status(200).json({ success: true, message: 'OTP generated', otp });
});

exports.verifyOtp = asyncHandler(async (req, res, next) => {
  await authService.verifyOtp(req.body);
  res.status(200).json({ success: true, message: 'OTP verified' });
});

exports.getSessions = asyncHandler(async (req, res, next) => {
  const sessions = authService.getSessions(req.user);
  res.status(200).json({ success: true, ...sessions });
});
