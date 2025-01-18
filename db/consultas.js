const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { secretKey } = require('../utils');

const app = express();

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
  database: 'futscript',
  allowExitOnIdle: true
});

const getTeams = async () => {
  const query = 'SELECT id, name FROM equipos';
  const result = await pool.query(query);
  return result.rows;
};

const getPlayers = async (teamID) => {
  const query = `
    SELECT jugadores.name, posiciones.name AS posicion
    FROM jugadores
    INNER JOIN equipos ON jugadores.id_equipo = equipos.id
    INNER JOIN posiciones ON jugadores.position = posiciones.id
    WHERE equipos.id = $1
  `;
  const result = await pool.query(query, [teamID]);
  return result.rows;
};

const addTeam = async (equipo) => {
  const query = 'INSERT INTO equipos (name) VALUES ($1) RETURNING *';
  const result = await pool.query(query, [equipo.name]);
  return result.rows[0];
};

const addPlayer = async ({ jugador, teamID }) => {
  const query = 'INSERT INTO jugadores (name, position, id_equipo) VALUES ($1, $2, $3) RETURNING *';
  const result = await pool.query(query, [jugador.name, jugador.position, teamID]);  // Cambié 'jugador.posicion' por 'jugador.position'
  return result.rows[0];
};

module.exports = { getTeams, addTeam, getPlayers, addPlayer };
