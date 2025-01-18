const jwt = require('jsonwebtoken');
const { secretKey } = require('../utils'); // Asegúrate de que este archivo tiene la clave secreta

// Middleware para validar el token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = user; // Adjunta el usuario validado a la solicitud
    next();
  });
};

module.exports = { authenticateToken };
