import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainPage from './components/ExecutorsPage';
import LoginPage from './components/LoginPage';
import ProfilePage from './pages/ProfilePage'; // создадим позже
import ChangePasswordPage from './pages/ChangePasswordPage'; // создадим позже
import './App.css';

function AppContent() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        !!localStorage.getItem('access_token')
    );

    useEffect(() => {
        const handleUnauthorized = () => setIsAuthenticated(false);
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, []);

    if (!isAuthenticated) {
        // Если не авторизован, всегда показываем страницу логина
        return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;