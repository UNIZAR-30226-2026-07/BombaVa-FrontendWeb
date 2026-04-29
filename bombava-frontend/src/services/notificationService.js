/**
 * Dispara un evento personalizado para mostrar una notificación
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duración en ms antes de desaparecer (default: 5000)
 * @param {string} position - Posición de la notificación: 'top', 'toast'
 */
const showNotification = (message, type = 'info', duration = 5000, position = 'top') => {
    if(position === 'top') {
        const event = new CustomEvent('addNotification', {
            detail: {
                message,
                type,
                duration
            }
        });
        window.dispatchEvent(event);
    } else if(position === 'toast') {
        const event = new CustomEvent('addToast', {
            detail: {
                message,
                type,
                duration
            }
        });
        window.dispatchEvent(event);
    }
};

/**
 * Objeto con métodos para cada tipo de notificación
 */
export const notification = {

    top: (message, type = 'info', duration = 5000) => {
        showNotification(message, type, duration, 'top');
    },    

    toast: (message, type = 'info', duration = 5000) => {
        showNotification(message, type, duration, 'toast');
    }
};
