const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { body } = require('express-validator');

router.use(auth);

router.post('/generate', [
  body('type').isIn(['defects', 'kpi']),
  body('format').isIn(['pdf', 'excel']),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  validate
], reportController.generateReport);

router.get('/', reportController.getReportHistory);
router.get('/:id', reportController.getReportById);
router.get('/:id/download', reportController.downloadReport);

module.exports = router;