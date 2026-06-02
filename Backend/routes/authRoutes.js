const express = require('express');
const {
  forgotPassword,
  getMe,
  getSessions,
  login,
  logout,
  register,
  resetPassword,
  sendOtp,
  updateDetails,
  updatePassword,
  verifyEmail,
  verifyOtp
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/profile', protect, getMe);
router.patch('/profile', protect, updateDetails);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', protect, updatePassword);
router.post('/verify-email', verifyEmail);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/sessions', protect, getSessions);

// Keep source-repo route names working too.
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
