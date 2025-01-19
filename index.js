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
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Documentación de la API FutScript</title>
    </head>
    <body>
        <h1>Bienvenido a la API FutScript</h1>
        <p>Esta API permite gestionar equipos y jugadores de fútbol.</p>
        
        <h2>Endpoints disponibles</h2>
        <ul>
            <li><strong>GET /equipos</strong>: Obtiene la lista de todos los equipos.</li>
            <li><strong>GET /equipos/:teamID/jugadores</strong>: Obtiene la lista de jugadores de un equipo específico.</li>
            <li><strong>POST /equipos</strong>: Crea un nuevo equipo. Requiere un cuerpo con <code>{ name }</code>.</li>
            <li><strong>POST /equipos/:teamID/jugadores</strong>: Agrega un nuevo jugador a un equipo. Requiere un cuerpo con <code>{ name, position }</code> y un token de autorización.</li>
            <li><strong>POST /login</strong>: Obtiene un JWT para autenticarse en otras rutas. Requiere <code>{ username, password }</code>.</li>
        </ul>
    </body>
    </html>
  `);
});

app.use(errorHandler);

module.exports = app;