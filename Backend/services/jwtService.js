const jwt = require('jsonwebtoken');
const Law = require('../models/Law');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

const signToken = payload =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });

const extractToken = input => input.bodyToken || (input.authorization || '').replace('Bearer ', '');

exports.signToken = signToken;

exports.getDashboard = async user => {
  const [totalLaws, archivedLaws] = await Promise.all([
    Law.countDocuments(),
    Law.countDocuments({ archived: true })
  ]);

  return { user, totalLaws, archivedLaws };
};

exports.generateToken = async ({ email, id, userId, payload }) => {
  const user = email ? await User.findOne({ email }) : null;
  const tokenPayload = user ? { id: user._id } : { id: id || userId, ...payload };

  if (!tokenPayload.id) {
    throw new ErrorResponse('id, userId, or email is required to generate a token', 400);
  }

  return signToken(tokenPayload);
};

exports.verifyToken = ({ bodyToken, authorization }) => {
  const token = extractToken({ bodyToken, authorization });
  if (!token) {
    throw new ErrorResponse('Token is required', 400);
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

exports.refreshToken = input => {
  const decoded = exports.verifyToken(input);
  delete decoded.iat;
  delete decoded.exp;

  return signToken(decoded);
};

exports.getPrivateLaws = () =>
  Law.find({ archived: { $ne: true } }).sort('-createdAt').limit(10);

exports.getPrivateAnalytics = async () => {
  const [totalLaws, totalUsers] = await Promise.all([
    Law.countDocuments(),
    User.countDocuments()
  ]);

  return { totalLaws, totalUsers };
};
