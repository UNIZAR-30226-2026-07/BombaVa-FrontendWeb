import { useState, useEffect } from 'react';
import '../styles/Notification.css';

/**
 * Componente para mostrar notificaciones temporales
 * @param {object} notification - Objeto con {id, message, type, duration}
 * @param {function} onClose - Callback cuando la notificación se cierra
 */
export const NotificationBar = ({ notification, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(notification.id);
        }, notification.duration || 5000);

        return () => clearTimeout(timer);
    }, [notification.id, notification.duration, onClose]);

    return (
        <div className={`notification ${notification.type || 'info'}`}>
            <div className="notification-message">
                {notification.message}
            </div>
            <button 
                className="notification-close" 
                onClick={() => onClose(notification.id)}
                aria-label="Cerrar notificación"
            >
                ×
            </button>
        </div>
    );
};

/**
 * Contenedor de notificaciones
 * Maneja el estado de múltiples notificaciones
 */
export const NotificationContainer = () => {
    const [notifications, setNotifications] = useState([]);

    // Subscriber para recibir notificaciones desde cualquier parte de la app
    useEffect(() => {
        const handleAddNotification = (event) => {
            const notification = {
                id: Date.now() + Math.random(),
                ...event.detail
            };
            setNotifications(prev => [...prev, notification]);
        };

        window.addEventListener('addNotification', handleAddNotification);
        return () => window.removeEventListener('addNotification', handleAddNotification);
    }, []);

    const handleCloseNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="notification-container">
            {notifications.map(notification => (
                <NotificationBar
                    key={notification.id}
                    notification={notification}
                    onClose={handleCloseNotification}
                />
            ))}
        </div>
    );
};
