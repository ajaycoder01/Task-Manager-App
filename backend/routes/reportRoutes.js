const express = require('express');
const { exportTasksReport, exportUsersReport } = require('../controllers/reportController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/export/tasks", protect,adminOnly,  exportTasksReport); // Export all tasks as Excel/CSV/PDF
router.get("/export/users", protect, adminOnly, exportUsersReport); // Export all user-tasks report 

module.exports = router;