import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Мокаем компоненты, чтобы тест фокусировался только на логике App
vi.mock('./components/ExecutorsPage', () => ({
  default: () => <div data-testid="main-page">Main Page Mock</div>
}));

vi.mock('./components/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login Page Mock</div>
}));

describe('App Component', () => {
  it('рендерит LoginPage, если пользователь не авторизован', () => {
    // Очищаем localStorage перед тестом
    localStorage.removeItem('access_token');
    
    render(<App />);
    
    // Проверяем, что на экране отображается страница логина
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('main-page')).not.toBeInTheDocument();
  });

  it('рендерит MainPage, если есть токен в localStorage', () => {
    // Имитируем наличие токена
    localStorage.setItem('access_token', 'fake_token');
    
    render(<App />);
    
    // Проверяем, что на экране отображается главная страница
    expect(screen.getByTestId('main-page')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    
    // Очищаем за собой
    localStorage.removeItem('access_token');
  });
});
