// Se encarga de la comunicación con el backend mediante WebSocket
import { io } from 'socket.io-client';
import { TAMANO_TABLERO } from './constantes.js';
import { notification } from '../services/notificationService.js';


// URL del backend desde variables de entorno (definida en .env con prefijo VITE_)
const URL_WEBSOCKET = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

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
  if(fail.message == "Ataque no disponible o munición insuficiente") {
    notification.top("Ataque no disponible. Cada barco solo tiene un ataque por turno.", 'error');
    return;
  }else if(fail.message == "Colisión detectada: Casilla ocupada") {
    notification.top("No puedes avanzar, la casilla está ocupada.", 'error');
    return;
  }
  console.log(fail.message);
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

// LOGS DE DEBUG PARA PROYECTILES
socket.on('projectile:launched', (payload) => {
  console.log('Nuevo proyectil desplegado:', payload);
});

socket.on('projectile:update', (payload) => {
  console.log('Proyectil actualizado:', payload);
});

socket.on('projectile:hit', (payload) => {
  console.log('Proyectil impactó:', payload);
});

socket.on('ship:attacked', (payload) => {
  console.log('Ataque de cañón:', payload);
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
  console.log(`Petición al backend: mover barco ${shipId} hacia ${direction}`);
  socket.emit('ship:move', { matchId, shipId, direction });
};

// Función para pedir al backend que rote un barco
export const peticionRotar = (matchId, shipId, degrees) => {
  console.log(`Petición al backend: rotar barco ${shipId}, ${degrees} grados`);
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
  console.log(`Petición al backend: cañonazo del barco ${shipId}}`);
  socket.emit('ship:attack:cannon', { matchId, shipId, target: { x, y: targetY } });
};

// Función para pedir al backend que ataque con la mina
export const peticionAtacarMina = (matchId, shipId, x, y) => {
  const targetY = traducirCoordY(y);
  console.log(`Petición al backend: mina del barco ${shipId}}`);
  socket.emit('ship:attack:mine', { matchId, shipId, target: { x, y: targetY } });
};

// Función para pedir al backend que ataque con el torpedo
export const peticionAtacarTorpedo = (matchId, shipId) => {
  console.log(`Petición al backend: torpedo del barco ${shipId}}`);
  socket.emit('ship:attack:torpedo', { matchId, shipId });
};

// Función para pedir al backend abandonar la partida
export const peticionAbandonarPartida = (matchId) => {
    console.log(`Petición al backend: abandonar partida ${matchId}`);
    socket.emit('match:surrender', { matchId });
};

// Función para pedir una pausa al otro jugador
export const peticionPausarPartida = (matchId) => {
    console.log(`Petición al backend: pausar la partida ${matchId}`);
    socket.emit('match:pause_request', { matchId });
};
