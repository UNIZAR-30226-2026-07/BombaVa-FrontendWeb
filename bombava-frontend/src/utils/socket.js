// Se encarga de la comunicación con el backend mediante WebSocket
import { io } from 'socket.io-client';

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

// Para ver cuando el usuario tiene un error al conectar con el servidor
socket.on('connect_error', (error) => {
  console.error('Error al conectar con el servidor WebSocket:', error.message);
});

// Para ver cuando el usuario se desconecta del servidor
socket.on('disconnect', () => {
  console.log('Desconectado del servidor WebSocket');
});
