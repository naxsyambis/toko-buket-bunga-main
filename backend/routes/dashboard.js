const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Terapkan middleware auth dan adminAuth secara berurutan
router.get('/stats', auth, adminAuth, getDashboardStats);

module.exports = router;