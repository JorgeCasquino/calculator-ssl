const express = require('express');
const router = express.Router();
const { validate } = require('../middleware/validate');
const { body } = require('express-validator');
const authController = require('../controllers/authController'); // Asegúrate de que esta línea esté presente

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;