// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userService } = require('../services');

const authController = {
    register: async (req, res) => {
        try {
            console.log('Registro iniciado:', req.body); // Debug log
            const { username, email, password } = req.body;

            // Validar datos
            if (!username || !email || !password) {
                return res.status(400).json({
                    error: 'Todos los campos son requeridos'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear usuario
            const user = await userService.createUser({
                username,
                email,
                password: hashedPassword
            });

            // Generar token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token
            });
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(400).json({
                error: error.message || 'Error al registrar usuario'
            });
        }
    },

    login: async (req, res) => {
      try {
        console.log('Intento de login:', req.body); // Debug log
        
        const { email, password } = req.body;
  
        // Validar que se proporcionaron email y password
        if (!email || !password) {
          console.log('Faltan credenciales'); // Debug log
          return res.status(400).json({
            error: 'Email y contraseña son requeridos'
          });
        }
  
        // Buscar usuario
        const user = await userService.findByEmail(email);
        console.log('Usuario encontrado:', user ? 'Sí' : 'No'); // Debug log
  
        if (!user) {
          return res.status(401).json({
            error: 'Credenciales inválidas'
          });
        }
  
        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Contraseña válida:', validPassword ? 'Sí' : 'No'); // Debug log
  
        if (!validPassword) {
          return res.status(401).json({
            error: 'Credenciales inválidas'
          });
        }
  
        // Generar token
        const token = jwt.sign(
          { 
            id: user.id, 
            email: user.email,
            username: user.username 
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
  
        // Enviar respuesta
        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username
          }
        });
      } catch (error) {
        console.error('Error en login:', error); // Debug log
        res.status(500).json({
          error: 'Error al procesar el login'
        });
      }
    },
};

module.exports = authController;