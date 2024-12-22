// src/routes/kpiRoutes.js
const express = require('express');
const router = express.Router();
const kpiController = require('../controllers/kpiController');
const auth = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(auth);

// Rutas para el dashboard y herramientas Six Sigma
router.get('/dashboard', kpiController.getDashboardData);
router.get('/pareto', kpiController.getParetoData);
router.get('/control-chart', kpiController.getControlChartData);
router.get('/histogram', kpiController.getHistogramData);
router.get('/scatter-plot', kpiController.getScatterPlotData);

module.exports = router;