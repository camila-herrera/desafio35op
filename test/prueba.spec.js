const request = require('supertest');
const app = require('../index');

describe('API FutScript Tests', () => {
  // Test para GET /equipos
  it('GET /equipos devuelve un array y código 200', async () => {
    const response = await request(app).get('/equipos');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test para POST /login con credenciales correctas
  it('POST /login con credenciales correctas devuelve JWT', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'admin', password: '1234' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  // Test para POST /login con credenciales incorrectas
  it('POST /login con credenciales incorrectas devuelve 400', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'wrong', password: 'wrong' });

    expect(response.status).toBe(400);
  });

  // Test para POST /equipos/:teamID/jugadores con token válido
  it('POST /equipos/:teamID/jugadores con token válido devuelve 201', async () => {
    // Primero obtener un token válido
    const loginResponse = await request(app)
      .post('/login')
      .send({ username: 'admin', password: '1234' });

    const token = loginResponse.body.token;

    // Luego, realizar la solicitud para agregar un jugador
    const response = await request(app)
      .post('/equipos/1/jugadores')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nuevo Jugador', position: 1 });

    expect(response.status).toBe(201);
  });
});
