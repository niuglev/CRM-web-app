import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import './SystemNotification.scss';

interface SystemNotificationProps {
    message?: string;
    duration?: number; // в миллисекундах
    onClose?: () => void;
}

const SystemNotification: React.FC<SystemNotificationProps> = ({
    message = 'Система была обновлена',
    duration = 5000,
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        onClose?.();
    };

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className="system-notification">
            <div className="system-notification__content">
                <FiCheckCircle className="system-notification__icon" />
                <span className="system-notification__message">{message}</span>
            </div>
            <button
                className="system-notification__close"
                onClick={handleClose}
                aria-label="Закрыть уведомление"
            >
                <FiX className="system-notification__close-icon" />
            </button>
        </div>
    );
};

export default SystemNotification;