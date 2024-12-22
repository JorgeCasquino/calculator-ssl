const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { userService } = require('../services/userService');

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
      
      const user = await userService.createUser({
        username,
        email,
        password: hashedPassword
      });

      res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userService.findByEmail(email);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = authController;