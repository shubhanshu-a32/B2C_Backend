const express = require('express');
const router = express.Router();
const {sendOtp, verifyOtp, refresh, logout} = require('../controllers/auth.controller');
const createLimiter = require('../middlewares/rateLimiter');

const authLimiter = createLimiter({windowMs: 60*1000, max: 8});

router.post('/send-otp', authLimiter, sendOtp);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;