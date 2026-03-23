const LOG_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1') + '/frontend-logs';

type LogLevel = 'info' | 'warn' | 'error';

interface LogData {
    level: LogLevel;
    message: string;
    context?: Record<string, any>;
    url: string;
    userAgent: string;
    timestamp: string;
}

const sendLog = async (level: LogLevel, message: string, context?: Record<string, any>) => {
    // Always output to developer console
    if (level === 'error') {
        console.error(`[${level.toUpperCase()}]`, message, context || '');
    } else if (level === 'warn') {
        console.warn(`[${level.toUpperCase()}]`, message, context || '');
    } else {
        console.log(`[${level.toUpperCase()}]`, message, context || '');
    }

    try {
        const logData: LogData = {
            level,
            message,
            context,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };

        const token = localStorage.getItem('access_token');
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Use fetch to prevent infinite loops with axios interceptors
        await fetch(LOG_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(logData),
            keepalive: true
        });
    } catch (e) {
        console.error('Failed to send log to backend:', e);
    }
};

export const logger = {
    info: (message: string, context?: Record<string, any>) => sendLog('info', message, context),
    warn: (message: string, context?: Record<string, any>) => sendLog('warn', message, context),
    error: (message: string, context?: Record<string, any>) => sendLog('error', message, context),
};
