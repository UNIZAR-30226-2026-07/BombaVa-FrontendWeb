/**
 * Gestión centralizada de tokens de autenticación
 */

/**
 * Obtiene el token de autenticación del localStorage
 * @returns {string|null} Token de autenticación o null si no existe
 */
export const getAuthToken = () => {
    return localStorage.getItem('token');
};

/**
 * Obtiene los headers de autenticación
 * @returns {object} Headers con el token de autorización
 */
export const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        Authorization: `Bearer ${token}`
    };
};

/**
 * Guarda el token en localStorage
 * @param {string} token - Token a guardar
 */
export const saveToken = (token) => {
    localStorage.setItem('token', token);
};

/**
 * Elimina el token del localStorage
 */
export const removeToken = () => {
    localStorage.removeItem('token');
};

/**
 * Verifica si hay un token válido
 * @returns {boolean} true si hay token, false en caso contrario
 */
export const hasToken = () => {
    return !!getAuthToken();
};
