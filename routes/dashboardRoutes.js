const express = require('express');
const protect = require('../middlewares/authMiddleware');
const { dashboardCards } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/dashboard-summary', protect, dashboardCards);
module.exports = router;