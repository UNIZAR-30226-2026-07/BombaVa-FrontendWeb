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

/**
 * Componente para mostrar notificaciones tipo Toast
 * @param {object} toast - Objeto con {id, message, type, duration}
 * @param {function} onClose - Callback cuando el toast se cierra
 */
export const ToastNotification = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onClose]);

    return (
        <div className={`toast ${toast.type || 'info'}`}>
            <div className="toast-message">
                {toast.message}
            </div>
            <button 
                className="toast-close" 
                onClick={() => onClose(toast.id)}
                aria-label="Cerrar notificación"
            >
                ×
            </button>
        </div>
    );
};

/**
 * Contenedor de toasts
 * Maneja el estado de múltiples notificaciones tipo toast
 */
export const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    // Subscriber para recibir toasts desde cualquier parte de la app
    useEffect(() => {
        const handleAddToast = (event) => {
            const toast = {
                id: Date.now() + Math.random(),
                ...event.detail
            };
            setToasts(prev => [...prev, toast]);
        };

        window.addEventListener('addToast', handleAddToast);
        return () => window.removeEventListener('addToast', handleAddToast);
    }, []);

    const handleCloseToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <ToastNotification
                    key={toast.id}
                    toast={toast}
                    onClose={handleCloseToast}
                />
            ))}
        </div>
    );
};
