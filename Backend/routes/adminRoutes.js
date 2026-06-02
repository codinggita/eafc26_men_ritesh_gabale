const express = require('express');
const {
  banUser,
  changeRole,
  clearCache,
  dashboard,
  getReports,
  getUser,
  getUsers,
  health,
  logs,
  maintenance,
  resolveReport,
  securityEvents,
  unbanUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', dashboard);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/unban', unbanUser);
router.patch('/users/:id/role', changeRole);
router.get('/reports', getReports);
router.patch('/reports/:id/resolve', resolveReport);
router.get('/system/health', health);
router.get('/system/logs', logs);
router.post('/system/maintenance', maintenance);
router.delete('/cache/clear', clearCache);
router.get('/security/events', securityEvents);

module.exports = router;
