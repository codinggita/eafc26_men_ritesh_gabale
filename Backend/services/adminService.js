const Law = require('../models/Law');
const User = require('../models/User');

let maintenanceMode = false;

exports.getDashboard = async () => {
  const [users, laws, archivedLaws] = await Promise.all([
    User.countDocuments(),
    Law.countDocuments(),
    Law.countDocuments({ archived: true })
  ]);

  return { users, laws, archivedLaws, maintenanceMode };
};

exports.getUsers = () => User.find().sort('-createdAt');

exports.getUser = id => User.findById(id);

exports.banUser = id => User.findByIdAndUpdate(id, { isBanned: true }, { new: true });

exports.unbanUser = id => User.findByIdAndUpdate(id, { isBanned: false }, { new: true });

exports.changeRole = (id, role) =>
  User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });

exports.getReports = async () => [];

exports.resolveReport = async id => ({ id, status: 'resolved' });

exports.getHealth = () => ({
  status: 'ok',
  uptime: process.uptime(),
  maintenanceMode,
  timestamp: new Date().toISOString()
});

exports.getLogs = async () => [];

exports.setMaintenanceMode = enabled => {
  maintenanceMode = Boolean(enabled);
  return { maintenanceMode };
};

exports.clearCache = async () => ({ message: 'Cache clear requested' });

exports.getSecurityEvents = async () => [];
