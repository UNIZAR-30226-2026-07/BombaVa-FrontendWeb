/**
 * Servicio de Notificaciones
 * Proporciona funciones para mostrar notificaciones en la app
 * 
 * Uso:
 * import { notification } from '../services/notificationService.js';
 * 
 * notification.success('¡Operación completada!');
 * notification.error('Ocurrió un error');
 * notification.warning('Cuidado con esto');
 * notification.info('Información importante');
 */

/**
 * Dispara un evento personalizado para mostrar una notificación
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duración en ms antes de desaparecer (default: 5000)
 */
const showNotification = (message, type = 'info', duration = 5000) => {
    const event = new CustomEvent('addNotification', {
        detail: {
            message,
            type,
            duration
        }
    });
    window.dispatchEvent(event);
};

/**
 * Objeto con métodos para cada tipo de notificación
 */
export const notification = {
    /**
     * Notificación de éxito (verde)
     * @param {string} message - Mensaje a mostrar
     * @param {number} duration - Duración en ms
     */
    success: (message, duration = 5000) => {
        showNotification(message, 'success', duration);
    },

    /**
     * Notificación de error (rojo)
     * @param {string} message - Mensaje a mostrar
     * @param {number} duration - Duración en ms
     */
    error: (message, duration = 5000) => {
        showNotification(message, 'error', duration);
    },

    /**
     * Notificación de advertencia (naranja)
     * @param {string} message - Mensaje a mostrar
     * @param {number} duration - Duración en ms
     */
    warning: (message, duration = 5000) => {
        showNotification(message, 'warning', duration);
    },

    /**
     * Notificación de información (azul)
     * @param {string} message - Mensaje a mostrar
     * @param {number} duration - Duración en ms
     */
    info: (message, duration = 5000) => {
        showNotification(message, 'info', duration);
    }
};
