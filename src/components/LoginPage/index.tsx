import React, { useState } from 'react';
import { authApi } from '../../api/auth';
import { useTranslation } from 'react-i18next';
import './LoginPage.scss';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const { t } = useTranslation();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getErrorDetail = (err: unknown): string | undefined => {
        if (typeof err !== 'object' || err === null) return undefined;
        const maybeResponse = (err as { response?: { data?: { detail?: unknown } } }).response;
        const detail = maybeResponse?.data?.detail;
        return typeof detail === 'string' ? detail : undefined;
    };

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
                await authApi.register(email, password, username || email.split('@')[0], fullName || t('login.defaultName'));
                // After register, automatically log in
                const data = await authApi.login(email, password);
                localStorage.setItem('access_token', data.access_token);
                onLoginSuccess();
            }
        } catch (err: unknown) {
            const detail = getErrorDetail(err);
            if (detail) {
                setError(detail);
            } else {
                setError(t('login.serverError'));
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
                    {isLogin ? t('login.signInTitle') : t('login.signUpTitle')}
                </h2>

                {error && <div className="login-page__error">{error}</div>}

                <form className="login-page__form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="login-page__form-group">
                                <label htmlFor="fullName">{t('login.fullNameLabel')}</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder={t('login.fullNamePlaceholder')}
                                    required={!isLogin}
                                />
                            </div>
                            <div className="login-page__form-group">
                                <label htmlFor="username">{t('login.usernameLabel')}</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder={t('login.usernamePlaceholder')}
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
                        <label htmlFor="password">{t('login.passwordLabel')}</label>
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
                        {isLoading ? t('login.loading') : (isLogin ? t('login.signInButton') : t('login.signUpButton'))}
                    </button>
                </form>

                <div className="login-page__footer">
                    {isLogin ? (
                        <p>{t('login.noAccount')} <button onClick={() => setIsLogin(false)}>{t('login.createAccount')}</button></p>
                    ) : (
                        <p>{t('login.hasAccount')} <button onClick={() => setIsLogin(true)}>{t('login.signInButton')}</button></p>
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
