import axios from 'axios';
import { SERVER_API } from '../utils/constantes.js';
import { getAuthHeaders, saveToken, removeToken } from './tokenManager.js';

/**
 * Registra un nuevo usuario
 * @param {object} credenciales - Objeto con username, email y contrasena
 * @returns {Promise<object>} Respuesta de la API con el token
 * @throws {Error} Si hay un error en el registro
 */
export const registrar = async (credenciales) => {
    try {
        const respuesta = await axios.post(
            SERVER_API + '/api/auth/register',
            credenciales
        );
        return respuesta.data;
    } catch (error) {
        const mensaje = error.response?.data?.errors?.[0]?.msg 
                       || error.response?.data?.message 
                       || error.message;
        throw new Error(mensaje);
    }
};

/**
 * Inicia sesión con credenciales de usuario
 * @param {object} credenciales - Objeto con email y contrasena
 * @returns {Promise<object>} Respuesta de la API con el token
 * @throws {Error} Si hay un error en el login
 */
export const login = async (credenciales) => {
    try {
        const respuesta = await axios.post(
            SERVER_API + '/api/auth/login',
            credenciales
        );
        return respuesta.data;
    } catch (error) {
        const mensaje = error.response?.data?.errors?.[0]?.msg 
                       || error.response?.data?.message 
                       || error.message;
        throw new Error(mensaje);
    }
};

/**
 * Obtiene los datos del usuario actual
 * @returns {Promise<object>} Objeto con los datos del usuario
 * @throws {Error} Si hay un error al obtener los datos
 */
export const obtenerPerfil = async () => {
    try {
        const respuesta = await axios.get(
            SERVER_API + '/api/auth/me',
            { headers: getAuthHeaders() }
        );
        return respuesta.data;
    } catch (error) {
        const mensaje = error.response?.data?.message 
                       || error.response?.data?.errors?.[0]?.msg 
                       || "Error desconocido";
        throw new Error(mensaje);
    }
};

/**
 * Guarda el token y reconecta el socket si es necesario
 * @param {string} token - Token de autenticación
 * @param {object} socket - Instancia del socket.io
 */
export const guardarToken = (token, socket = null) => {
    saveToken(token);
    
    // Si hay socket, desconectar y reconectar con nuevo token
    if (socket) {
        socket.disconnect();
        socket.connect();
    }
};

/**
 * Elimina el token del localStorage
 */
export const limpiarToken = () => {
    removeToken();
};
