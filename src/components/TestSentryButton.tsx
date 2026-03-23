import React from 'react';

const TestSentryButton: React.FC = () => {
  return (
    <button
      onClick={() => {
        throw new Error("Тестовая ошибка для Sentry! Если вы это видите в панели sentry.io, значит все работает!");
      }}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        padding: '10px 15px',
        backgroundColor: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      Отправить тестовую ошибку в Sentry 🔥
    </button>
  );
};

export default TestSentryButton;
