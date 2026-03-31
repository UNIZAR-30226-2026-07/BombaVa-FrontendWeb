import { socket } from '../utils/socket.js';

/**
 * Registra todos los listeners de eventos del juego
 * @param {object} handlers - Objeto con las funciones handlers para cada evento
 * @returns {function} Función de cleanup para desuscribirse de todos los eventos
 * 
 * Ejemplo de handlers:
 * {
 *   onStartInfo: (payload) => {...},
 *   onVisionUpdate: (payload) => {...},
 *   onShipMoved: (payload) => {...},
 *   onShipRotated: (payload) => {...},
 *   onTurnChanged: (payload) => {...},
 *   onShipAttacked: (payload) => {...}
 * }
 */
export const setupGameListeners = (handlers) => {
    const {
        onStartInfo,
        onVisionUpdate,
        onShipMoved,
        onShipRotated,
        onTurnChanged,
        onShipAttacked,
        onMatchFinished
    } = handlers;

    // Registrar todos los listeners
    if (onStartInfo) socket.on('match:startInfo', onStartInfo);
    if (onVisionUpdate) socket.on('match:vision_update', onVisionUpdate);
    if (onShipMoved) socket.on('ship:moved', onShipMoved);
    if (onShipRotated) socket.on('ship:rotated', onShipRotated);
    if (onTurnChanged) socket.on('match:turn_changed', onTurnChanged);
    if (onShipAttacked) socket.on('ship:attacked', onShipAttacked);
    if (onMatchFinished) socket.on('match:finished', onMatchFinished);

    // Retornar función de cleanup
    return () => {
        if (onStartInfo) socket.off('match:startInfo', onStartInfo);
        if (onVisionUpdate) socket.off('match:vision_update', onVisionUpdate);
        if (onShipMoved) socket.off('ship:moved', onShipMoved);
        if (onShipRotated) socket.off('ship:rotated', onShipRotated);
        if (onTurnChanged) socket.off('match:turn_changed', onTurnChanged);
        if (onShipAttacked) socket.off('ship:attacked', onShipAttacked);
        if (onMatchFinished) socket.off('match:finished', onMatchFinished);
    };
};

/**
 * Carga los datos iniciales de la partida desde localStorage
 * @returns {object|null} Datos de la partida o null si no existen
 */
export const cargarEstadoPartida = () => {
    const estadoGuardado = localStorage.getItem('bombaVa_matchState');
    if (estadoGuardado) {
        return JSON.parse(estadoGuardado);
    }
    return null;
};

/**
 * Guarda el estado de la partida en localStorage
 * @param {object} estado - Estado de la partida a guardar
 */
export const guardarEstadoPartida = (estado) => {
    localStorage.setItem('bombaVa_matchState', JSON.stringify(estado));
};

/**
 * Elimina el estado de la partida de localStorage
 */
export const eliminarEstadoPartida = () => {
    localStorage.removeItem('bombaVa_matchState');
};

/**
 * Se conecta a la sala de juego
 * @param {string} gameId - ID de la partida
 */
export const unirseASalaDeJuego = (gameId) => {
    socket.emit('game:join', gameId);
};

/**
 * Actualiza el estado de la partida con nuevos datos
 * @param {object} matchState - Estado actual de la partida
 * @param {object} updates - Objeto con los campos a actualizar
 * @returns {object} Estado actualizado
 */
export const actualizarEstadoPartida = (matchState, updates) => {
    const estadoActualizado = {
        ...matchState,
        ...updates
    };
    guardarEstadoPartida(estadoActualizado);
    return estadoActualizado;
};
