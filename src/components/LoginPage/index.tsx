import React, { useState } from 'react';
import { authApi } from '../../api/auth';
import './LoginPage.scss';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                const data = await authApi.login(email, password);
                localStorage.setItem('access_token', data.access_token);
                onLoginSuccess();
            } else {
                await authApi.register(email, password, username || email.split('@')[0], fullName || 'Без имени');
                // After register, automatically log in
                const data = await authApi.login(email, password);
                localStorage.setItem('access_token', data.access_token);
                onLoginSuccess();
            }
        } catch (err: any) {
            if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Произошла ошибка при подключении к серверу');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-page__container">
                <h1 className="login-page__title">KP-CRM</h1>
                <h2 className="login-page__subtitle">
                    {isLogin ? 'Вход в систему' : 'Регистрация'}
                </h2>

                {error && <div className="login-page__error">{error}</div>}

                <form className="login-page__form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="login-page__form-group">
                                <label htmlFor="fullName">Ваше Имя и Фамилия</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Иван Иванов"
                                    required={!isLogin}
                                />
                            </div>
                            <div className="login-page__form-group">
                                <label htmlFor="username">Имя пользователя (Никнейм)</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="ivan_i"
                                />
                            </div>
                        </>
                    )}
                    <div className="login-page__form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div className="login-page__form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="login-page__button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                    </button>
                </form>

                <div className="login-page__footer">
                    {isLogin ? (
                        <p>Нет аккаунта? <button onClick={() => setIsLogin(false)}>Создать</button></p>
                    ) : (
                        <p>Уже есть аккаунт? <button onClick={() => setIsLogin(true)}>Войти</button></p>
                    )}
                </div>
            </div>

            <div className="login-page__decoration">
                <div className="login-page__quarter-circle"></div>
                <div className="login-page__white-arc"></div>
            </div>
        </div>
    );
};

export default LoginPage;
