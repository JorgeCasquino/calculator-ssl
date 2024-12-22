const express = require('express');
const router = express.Router();
const kpiController= require('../controllers/kpiController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/dashboard', kpiController.getDashboardData);
router.get('/pareto', kpiController.getParetoData);
router.get('/control-chart', kpiController.getControlChartData);
router.get('/histogram', kpiController.getHistogramData);
module.exports = router;