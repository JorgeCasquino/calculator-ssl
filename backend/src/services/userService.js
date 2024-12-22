const pool = require('../config/database');

const userService = {
  createUser: async (userData) => {
    const { username, email, password } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    return { id: result.insertId, username, email };
  },

  findByEmail: async (email) => {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return users[0];
  },

  findById: async (id) => {
    const [users] = await pool.execute(
      'SELECT id, username, email FROM users WHERE id = ?',
      [id]
    );
    return users[0];
  }
};