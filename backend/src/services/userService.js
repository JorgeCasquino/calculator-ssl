const pool = require('../config/database');

const userService = {
  findByEmail: async (email) => {
    try {
      console.log('Buscando usuario por email:', email); // Debug log
      
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      console.log('Resultado de búsqueda:', rows.length ? 'Usuario encontrado' : 'Usuario no encontrado'); // Debug log
      
      return rows[0];
    } catch (error) {
      console.error('Error al buscar usuario por email:', error);
      throw new Error('Error al buscar usuario');
    }
  },

  createUser: async (userData) => {
    try {
      const { username, email, password } = userData;
      
      // Verificar si el usuario ya existe
      const existingUser = await userService.findByEmail(email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }
      
      const [result] = await pool.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
      );
      
      return {
        id: result.insertId,
        username,
        email
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, email FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error al buscar usuario por ID:', error);
      throw error;
    }
  }
};

module.exports = userService;