import axios from 'axios';
import { SERVER_API, TAMANO_TABLERO } from '../utils/constantes.js';
import { getAuthHeaders } from './tokenManager.js';

/**
 * Convierte los datos de barcos al formato esperado por la API
 * @param {array} barcos - Array de barcos del tablero
 * @returns {object} Objeto con formato esperado por la API
 */
const construirDatosDeck = (barcos) => {
    return {
        deckName: "Mi Nueva Flota",
        shipIds: barcos.map(b => {
            // Saco la celda del centro porque en el backend las celdas se enumeran al reves 
            // (de abajo a arriba en vez de de arriba a abajo)
            const celdaCentral = b.celdas[Math.floor(b.tamano / 2)];

            return {
                userShipId: b.id,
                position: {
                    x: celdaCentral.x,
                    y: (TAMANO_TABLERO - 1) - celdaCentral.y  // El - 1 porque empiezan por 0
                },
                orientation: b.orientacion
            };
        })
    };
};

/**
 * Crea un nuevo deck (flota) en la API
 * @param {array} barcos - Array de barcos a guardar
 * @returns {Promise<object>} Respuesta de la API con los datos del deck creado
 * @throws {Error} Si hay un error en la llamada a la API
 */
export const crearDeck = async (barcos) => {
    try {
        const datosDeck = construirDatosDeck(barcos);
        
        const respuesta = await axios.post(
            SERVER_API + '/api/inventory/decks',
            datosDeck,
            { headers: getAuthHeaders() }
        );
        
        return respuesta.data;
    } catch (error) {
        const mensaje = error.response?.data?.message || error.message;
        throw new Error(`Error al guardar: ${mensaje}`);
    }
};

/**
 * Activa un deck específico en la API
 * @param {string} deckId - ID del deck a activar
 * @param {array} barcos - Array de barcos del deck
 * @returns {Promise<object>} Respuesta de la API
 * @throws {Error} Si hay un error en la llamada a la API
 */
export const activarDeck = async (deckId, barcos) => {
    try {
        const datosDeck = construirDatosDeck(barcos);
        
        const respuesta = await axios.patch(
            SERVER_API + `/api/inventory/decks/${deckId}/activate`,
            datosDeck,
            { headers: getAuthHeaders() }
        );
        
        return respuesta.data;
    } catch (error) {
        const mensaje = error.response?.data?.message || error.message;
        throw new Error(`Error al activar: ${mensaje}`);
    }
};

/**
 * Crea y activa un deck en una sola operación
 * @param {array} barcos - Array de barcos a guardar y activar
 * @returns {Promise<object>} Respuesta de la API con los datos del deck activado
 * @throws {Error} Si hay un error en cualquiera de las llamadas a la API
 */
export const crearYActivarDeck = async (barcos) => {
    try {
        // Primero creamos el deck
        const deckCreado = await crearDeck(barcos);
        
        // Luego lo activamos
        const deckActivado = await activarDeck(deckCreado.id, barcos);
        
        return deckActivado;
    } catch (error) {
        throw error;
    }
};
