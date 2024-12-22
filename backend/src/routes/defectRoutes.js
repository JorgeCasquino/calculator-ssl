const express = require('express');
const router = express.Router();
const defectController = require('../controllers/defectController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { body, query } = require('express-validator');

router.use(auth); // Proteger todas las rutas de defectos

router.post('/', [
  body('type').trim().notEmpty(),
  body('process').trim().notEmpty(),
  body('date').isISO8601(),
  validate
], defectController.create);

router.get('/', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  validate
], defectController.getAll);

router.get('/:id', defectController.getById);

router.put('/:id', [
  body('type').trim().notEmpty(),
  body('process').trim().notEmpty(),
  body('date').isISO8601(),
  validate
], defectController.update);

router.delete('/:id', defectController.delete);

module.exports = router;