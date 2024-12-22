module.exports = {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h'
    },
    bcrypt: {
      saltRounds: 10
    },
    upload: {
      allowedTypes: ['xlsx', 'xls', 'csv'],
      maxSize: 5 * 1024 * 1024 // 5MB
    }
  };