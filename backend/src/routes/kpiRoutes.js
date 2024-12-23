// backend/src/routes/kpiRoutes.js
const express = require('express');
const router = express.Router();
const kpiController = require('../controllers/kpiController');
const auth = require('../middleware/auth');

router.use(auth);

// Rutas existentes
router.get('/dashboard', kpiController.getDashboardData);

// Nuevas rutas para análisis de datos
router.get('/pareto', kpiController.getParetoData);
router.get('/control-chart', kpiController.getControlChartData);
router.get('/histogram', kpiController.getHistogramData);
router.get('/scatter-plot', kpiController.getScatterPlotData);

module.exports = router;