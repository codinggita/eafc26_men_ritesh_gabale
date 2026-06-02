const asyncHandler = require('../middlewares/async');
const adminService = require('../services/adminService');

exports.dashboard = asyncHandler(async (req, res, next) => {
  const data = await adminService.getDashboard();
  res.status(200).json({ success: true, data });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await adminService.getUsers();
  res.status(200).json({ success: true, count: users.length, data: users });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await adminService.getUser(req.params.id);
  res.status(200).json({ success: true, data: user });
});

exports.banUser = asyncHandler(async (req, res, next) => {
  const user = await adminService.banUser(req.params.id);
  res.status(200).json({ success: true, data: user });
});

exports.unbanUser = asyncHandler(async (req, res, next) => {
  const user = await adminService.unbanUser(req.params.id);
  res.status(200).json({ success: true, data: user });
});

exports.changeRole = asyncHandler(async (req, res, next) => {
  const user = await adminService.changeRole(req.params.id, req.body.role);
  res.status(200).json({ success: true, data: user });
});

exports.getReports = asyncHandler(async (req, res, next) => {
  const reports = await adminService.getReports();
  res.status(200).json({ success: true, count: reports.length, data: reports });
});

exports.resolveReport = asyncHandler(async (req, res, next) => {
  const data = await adminService.resolveReport(req.params.id);
  res.status(200).json({ success: true, data });
});

exports.health = asyncHandler(async (req, res, next) => {
  const data = adminService.getHealth();
  res.status(200).json({ success: true, data });
});

exports.logs = asyncHandler(async (req, res, next) => {
  const data = await adminService.getLogs();
  res.status(200).json({ success: true, data });
});

exports.maintenance = asyncHandler(async (req, res, next) => {
  const data = adminService.setMaintenanceMode(req.body.enabled);
  res.status(200).json({ success: true, data });
});

exports.clearCache = asyncHandler(async (req, res, next) => {
  const data = await adminService.clearCache();
  res.status(200).json({ success: true, message: data.message });
});

exports.securityEvents = asyncHandler(async (req, res, next) => {
  const data = await adminService.getSecurityEvents();
  res.status(200).json({ success: true, count: data.length, data });
});
