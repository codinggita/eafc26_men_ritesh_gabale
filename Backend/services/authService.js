const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

const buildOtp = () => ({
  code: Math.floor(100000 + Math.random() * 900000).toString(),
  expiresAt: new Date(Date.now() + 10 * 60 * 1000)
});

const findProfileUser = async ({ user, email }) => {
  if (user) {
    return user;
  }

  if (email) {
    return User.findOne({ email });
  }

  return null;
};

const sanitizeProfileUpdates = fields => {
  const updates = { ...fields };

  Object.keys(updates).forEach(key => {
    if (updates[key] === undefined) {
      delete updates[key];
    }
  });

  return updates;
};

exports.issueToken = user => user.getSignedJwtToken();

exports.register = ({ name, email, password, role }) =>
  User.create({ name, email, password, role });

exports.login = async ({ email, password, userAgent, ip }) => {
  if (!email || !password) {
    throw new ErrorResponse('Please provide an email and password', 400);
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || user.isBanned) {
    throw new ErrorResponse('Invalid credentials', 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ErrorResponse('Invalid credentials', 401);
  }

  user.activeSessions.push({
    createdAt: new Date(),
    userAgent: userAgent || null,
    ip
  });
  await user.save({ validateBeforeSave: false });

  return user;
};

exports.logout = async user => {
  if (!user) {
    return;
  }

  user.activeSessions = [];
  await user.save({ validateBeforeSave: false });
};

exports.getCurrentUser = userId => User.findById(userId);

exports.updateDetails = (userId, fields) =>
  User.findByIdAndUpdate(userId, sanitizeProfileUpdates(fields), {
    new: true,
    runValidators: true
  });

exports.updatePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    throw new ErrorResponse('Password is incorrect', 401);
  }

  user.password = newPassword;
  await user.save();
  return user;
};

exports.forgotPassword = async ({ user, email }) => {
  const profileUser = await findProfileUser({ user, email });
  if (!profileUser) {
    throw new ErrorResponse('User not found', 404);
  }

  const resetCode = buildOtp();
  profileUser.otp = resetCode;
  await profileUser.save({ validateBeforeSave: false });

  return resetCode.code;
};

exports.resetPassword = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.otp || user.otp.code !== otp || user.otp.expiresAt < new Date()) {
    throw new ErrorResponse('Invalid or expired reset code', 400);
  }

  user.password = newPassword;
  user.otp = undefined;
  await user.save();
  return user;
};

exports.verifyEmail = async ({ user, email }) => {
  const profileUser = await findProfileUser({ user, email });
  if (!profileUser) {
    throw new ErrorResponse('User not found', 404);
  }

  profileUser.emailVerified = true;
  await profileUser.save({ validateBeforeSave: false });
};

exports.sendOtp = async ({ user, email }) => {
  const profileUser = await findProfileUser({ user, email });
  if (!profileUser) {
    throw new ErrorResponse('User not found', 404);
  }

  const otp = buildOtp();
  profileUser.otp = otp;
  await profileUser.save({ validateBeforeSave: false });

  return otp.code;
};

exports.verifyOtp = async ({ email, otp }) => {
  const user = await User.findOne({ email });

  if (!user || !user.otp || user.otp.code !== otp || user.otp.expiresAt < new Date()) {
    throw new ErrorResponse('Invalid or expired OTP', 400);
  }

  user.emailVerified = true;
  user.otp = undefined;
  await user.save({ validateBeforeSave: false });
};

exports.getSessions = user => ({
  count: user.activeSessions.length,
  data: user.activeSessions
});
