const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { secretKey } = require('./utils');


const { login } = require('./controllers/auth');
const { obtenerJugadores, registrarJugador } = require('./controllers/jugadores');
const { obtenerEquipos, agregarEquipo } = require('./controllers/equipos');

app.listen(3000, console.log("SERVIDOR ON FIRE"));
app.use(express.json());

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

    req.user = user;
    next();
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
};

app.post('/login', login);
app.get("/equipos", obtenerEquipos);
app.post("/equipos", authenticateToken, agregarEquipo);
app.get("/equipos/:teamID/jugadores", obtenerJugadores);
app.post("/equipos/:teamID/jugadores", authenticateToken, registrarJugador);

app.use(errorHandler);

module.exports = app;