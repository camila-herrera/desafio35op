const { getPlayers, addPlayer } = require('../db/consultas')

const obtenerJugadores = async (req, res) => {
    const { teamID } = req.params;
    try {
      const jugadores = await getPlayers(parseInt(teamID, 10));
      res.status(200).json(jugadores);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los jugadores' });
    }
  };

  const registrarJugador = async (req, res) => {
    const { teamID } = req.params;
    const jugador = req.body;
    try {
      const nuevoJugador = await addPlayer({ jugador, teamID });
      res.status(201).json(nuevoJugador); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al agregar el jugador' });
    }
  };
  


module.exports = { obtenerJugadores, registrarJugador }