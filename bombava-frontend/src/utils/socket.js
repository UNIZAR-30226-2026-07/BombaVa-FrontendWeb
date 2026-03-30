// Se encarga de la comunicación con el backend mediante WebSocket
import { io } from 'socket.io-client';
import { TAMANO_TABLERO } from './constantes.js';



// URL del backend
const URL_WEBSOCKET = 'http://localhost:3000';

// Se crea una instancia de socket para toda la aplicación
export const socket = io(URL_WEBSOCKET, {
  autoConnect: true,
  // Usamos una función para que lea el token del localStorage cada vez que intente conectarse
  auth: (cb) => {
    const token = localStorage.getItem('token');
    cb({ token });
  }
});

// Para ver cuando el usuario se conecta al servidor
socket.on('connect', () => {
  console.log('Conectado al servidor WebSocket:', socket.id);
});

// Escucha los fallos que lleguen del servidor
socket.on('game:error', (fail) => {
  alert('El Servidor ha rechazado tu acción:\n' + fail.message);
});

// Para ver cuando el usuario tiene un error al conectar con el servidor
socket.on('connect_error', (error) => {
  console.error('Error al conectar con el servidor WebSocket:', error.message);
});

// Para ver cuando el usuario se desconecta del servidor
socket.on('disconnect', () => {
  console.log('Desconectado del servidor WebSocket');
});

// Función que traduce el eje Y entre el frontend (0,0 Arriba-Izq) y el backend (0,0 Abajo-Izq)
export const traducirCoordY = (y) => {
  return (TAMANO_TABLERO - 1) - y;
};

/////////////////////////////////////
//  Funciones centralizadas para pedir al backend
/////////////////////////////////////

// Función para pedir al backend que mueva un barco
export const peticionMoverse = (matchId, shipId, direction) => {
  let dirFinal = direction;
  
  //QUITAR ES EL APAÑO PARA SOLUCIONAR DE MANERA TEMPORAL EL PROBLEMA DE LA API
  if (localStorage.getItem('bombaVa_esHost') == 'true') {
    const opuestos = { 'N': 'S', 'S': 'N', 'E': 'E', 'W': 'W' };
    dirFinal = opuestos[direction];
  }

  console.log(`Petición al backend: mover barco ${shipId} hacia ${dirFinal} (Original: ${direction})`);
  socket.emit('ship:move', { matchId, shipId, direction: dirFinal });
};

// Función para pedir al backend que rote un barco
export const peticionRotar = (matchId, shipId, degrees) => {
  console.log(`Petición al backend: rotar barco ${shipId} ${degrees} grados`);
  socket.emit('ship:rotate', { matchId, shipId, degrees });
};

// Función para pedir al backend que pase el turno
export const peticionPasarTurno = (matchId) => {
  console.log(`Petición al backend: pasar turno`);
  socket.emit('match:turn_end', { matchId });
};

// Función para pedir al backend que ataque con el cañón
export const peticionAtacarCanon = (matchId, shipId, x, y) => {
  const targetY = traducirCoordY(y);
  console.log(`Petición al backend: cañonazo del barco ${shipId} a la casilla FRONT {x:${x}, y:${y}} -> BACK {x:${x}, y:${targetY}}`);
  socket.emit('ship:attack:cannon', { matchId, shipId, target: { x, y: targetY } });
};
