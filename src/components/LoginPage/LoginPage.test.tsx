import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './index';
import { authApi } from '../../api/auth';

// Mock the authApi
vi.mock('../../api/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  }
}));

describe('LoginPage Component', () => {
  const mockOnLoginSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Вход в систему');
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });

  it('switches to registration form when clicking create account', () => {
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    
    fireEvent.click(screen.getByText('Создать'));
    
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Регистрация');
    expect(screen.getByLabelText('Ваше Имя и Фамилия')).toBeInTheDocument();
    expect(screen.getByLabelText('Имя пользователя (Никнейм)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockToken = 'mock_access_token';
    (authApi.login as any).mockResolvedValueOnce({ access_token: mockToken });
    
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Пароль'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    
    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(localStorage.getItem('access_token')).toBe(mockToken);
      expect(mockOnLoginSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message on login failure', async () => {
    const errorMessage = 'Неверный email или пароль';
    (authApi.login as any).mockRejectedValueOnce({
      response: { data: { detail: errorMessage } }
    });
    
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByLabelText('Пароль'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
    const mockToken = 'new_user_token';
    (authApi.register as any).mockResolvedValueOnce({});
    (authApi.login as any).mockResolvedValueOnce({ access_token: mockToken });
    
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    
    // Switch to register mode
    fireEvent.click(screen.getByText('Создать'));
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Ваше Имя и Фамилия'), { target: { value: 'Иван Иванов' } });
    fireEvent.change(screen.getByLabelText('Имя пользователя (Никнейм)'), { target: { value: 'ivan_i' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('Пароль'), { target: { value: 'securepass' } });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));
    
    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith('new@example.com', 'securepass', 'ivan_i', 'Иван Иванов');
      expect(authApi.login).toHaveBeenCalledWith('new@example.com', 'securepass');
      expect(localStorage.getItem('access_token')).toBe(mockToken);
      expect(mockOnLoginSuccess).toHaveBeenCalled();
    });
  });
});
