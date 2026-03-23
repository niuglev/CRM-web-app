import { useState, useEffect } from 'react'
import MainPage from './components/ExecutorsPage'
import LoginPage from './components/LoginPage'
import './App.css'
import { useTranslation } from 'react-i18next'

function App() {


  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('access_token')
  );

  useEffect(() => {
    const handleUnauthorized = () => setIsAuthenticated(false);
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return <MainPage />
}

export default App
