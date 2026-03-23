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

  return (
    <>
      {!isAuthenticated ? (
        <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <MainPage />
      )}
    </>
  );
}

export default App
