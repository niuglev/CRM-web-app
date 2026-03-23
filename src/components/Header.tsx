import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiBell, FiMenu, FiX } from 'react-icons/fi';
import UserDropdown from './UserDropdown';
import SystemNotification from './SystemNotification';
import './Header.scss';
import { useTranslation } from 'react-i18next';

export interface HeaderProps {
    userName: string;
    userInitials: string;
    isVisible?: boolean;
    onNotificationClick?: () => void;
    onStatisticsClick?: () => void;
    onLogoutClick?: () => void;
    onMenuToggle?: () => void;
    isMenuOpen?: boolean;
    showSystemNotification?: boolean;
    notificationMessage?: string;
}

const Header: React.FC<HeaderProps> = ({
    userName,
    userInitials,
    isVisible = true,
    onNotificationClick,
    onStatisticsClick,
    onLogoutClick,
    onMenuToggle,
    isMenuOpen = false,
    showSystemNotification = false,
}) => {
    const { t } = useTranslation();
    const notificationMessage = t('systemReload');
    const [isScrolled, setIsScrolled] = useState(false);
    const [showNotification, setShowNotification] = useState(showSystemNotification);
    const [notificationCount, setNotificationCount] = useState(0);

    // Эффект для отслеживания скролла
    useEffect(() => {
        const checkScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        checkScroll();
        window.addEventListener('scroll', checkScroll, { passive: true });
        return () => window.removeEventListener('scroll', checkScroll);
    }, []);

    // Эффект для симуляции уведомлений (в реальном приложении получать из API)
    useEffect(() => {
        const timer = setInterval(() => {
            // Случайное обновление счетчика уведомлений
            if (Math.random() > 0.7) {
                setNotificationCount(prev => prev + 1);
            }
        }, 30000);

        return () => clearInterval(timer);
    }, []);

    // Обработчик клика по колокольчику
    const handleBellClick = useCallback(() => {
        setNotificationCount(0);
        onNotificationClick?.();
    }, [onNotificationClick]);

    // Обработчик закрытия системного уведомления
    const handleNotificationClose = useCallback(() => {
        setShowNotification(false);
    }, []);

    // Обработчики для UserDropdown
    const handleStatisticsClick = useCallback(() => {
        onStatisticsClick?.();
    }, [onStatisticsClick]);

    const handleLogoutClick = useCallback(() => {
        onLogoutClick?.();
    }, [onLogoutClick]);

    // Обработчик клика по меню (для мобильной версии)
    const handleMenuToggle = useCallback(() => {
        onMenuToggle?.();
    }, [onMenuToggle]);


    return (
        <>
            <header className={`header ${isScrolled ? 'header--scrolled' : ''} ${!isVisible ? 'header--hidden' : ''}`}>
                <div className="header__main">
                    <div className="header__left">
                        <button
                            className="header__menu-toggle"
                            onClick={handleMenuToggle}
                            aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <FiX /> : <FiMenu />}
                        </button>
                        <h1 className="header__logo">KP-CRM</h1>
                    </div>

                    <div className="header__center">
                        <div className="header__search">
                            <FiSearch className="header__search-icon" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="header__search-input"
                                aria-label={t('header_search_input')}
                            />
                        </div>
                    </div>

                    <div className="header__right">
                        <button
                            className="header__notification"
                            onClick={handleBellClick}
                            aria-label={`${t('header.notifications')} ${notificationCount > 0 ? `(${notificationCount} ${t('header.new')})` : ''}`}
                        >
                            <FiBell className="header__bell" />
                            {notificationCount > 0 && (
                                <span className="header__notification-badge">{notificationCount}</span>
                            )}
                        </button>

                        <div className="header__user-dropdown">
                            <UserDropdown
                                userName={userName}
                                onStatisticsClick={handleStatisticsClick}
                                onLogoutClick={handleLogoutClick}
                                userInitials={userInitials}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {showNotification && (
                <SystemNotification
                    message={notificationMessage}
                    duration={5000}
                    onClose={handleNotificationClose}
                />
            )}
        </>
    );
};

export default Header;