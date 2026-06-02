const express = require('express');
const {
  dashboard,
  generateToken,
  privateAnalytics,
  privateLaws,
  profile,
  refreshToken,
  revokeToken,
  verifyToken
} = require('../controllers/jwtController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/profile', protect, profile);
router.get('/dashboard', protect, dashboard);
router.post('/generate-token', generateToken);
router.post('/verify-token', verifyToken);
router.post('/refresh-token', refreshToken);
router.delete('/revoke-token', protect, revokeToken);
router.get('/private-laws', protect, privateLaws);
router.get('/private-analytics', protect, privateAnalytics);

module.exports = router;
