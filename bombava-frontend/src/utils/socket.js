// Se encarga de la comunicación con el backend mediante WebSocket
import { io } from 'socket.io-client';

// URL del backend
const URL_WEBSOCKET = 'http://localhost:3000';

// Se crea una instancia de socket para toda la aplicación
export const socket = io(URL_WEBSOCKET, {
  autoConnect: true,
  // Habrá que poner el token del usuario logueado
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViOWU3YTgxLTgxZjgtNDU4MC1iNDVmLWNiZTFhYTQ1YWU2ZiIsIm5vbWJyZVVzdWFyaW8iOiJvc2Nhcl90ZXN0ZXIiLCJlbWFpbCI6Im9zY2FyQHRlc3QuY29tIiwiaWF0IjoxNzc0MzU2OTA4LCJleHAiOjE3NzQ0NDMzMDh9.C_eR1JpUZU36HAF9l-RsQUR4ySe7X3UdBlGukeTCByw"
  }
});

// Para ver cuando el usuario se conecta al servidor
socket.on('connect', () => {
  console.log('Conectado al servidor WebSocket:', socket.id);
});

// Para ver cuando el usuario tiene un error al conectar con el servidor
socket.on('connect_error', (error) => {
  console.error('Error al conectar con el servidor WebSocket:', error.message);
});

// Para ver cuando el usuario se desconecta del servidor
socket.on('disconnect', () => {
  console.log('Desconectado del servidor WebSocket');
});
