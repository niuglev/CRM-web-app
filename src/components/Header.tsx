import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';
import UserDropdown from './UserDropdown';
import './Header.scss';
import { useTranslation } from 'react-i18next';

export interface HeaderProps {
    userName: string;
    userInitials: string;
    userAvatarUrl?: string | null;
    isVisible?: boolean;
    onStatisticsClick?: () => void;
    onProfileClick?: () => void;
    onLogoutClick?: () => void;
    onMenuToggle?: () => void;
    isMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    userName,
    userInitials,
    userAvatarUrl,
    isVisible = true,
    onStatisticsClick,
    onProfileClick,
    onLogoutClick,
    onMenuToggle,
    isMenuOpen = false,
}) => {
    const { t } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const checkScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        checkScroll();
        window.addEventListener('scroll', checkScroll, { passive: true });
        return () => window.removeEventListener('scroll', checkScroll);
    }, []);

    const handleStatisticsClick = useCallback(() => {
        onStatisticsClick?.();
    }, [onStatisticsClick]);

    const handleLogoutClick = useCallback(() => {
        onLogoutClick?.();
    }, [onLogoutClick]);

    const handleProfileClick = useCallback(() => {
        onProfileClick?.();
    }, [onProfileClick]);

    const handleMenuToggle = useCallback(() => {
        onMenuToggle?.();
    }, [onMenuToggle]);

    return (
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
                    <div className="header__user-dropdown">
                        <UserDropdown
                            userName={userName}
                            onStatisticsClick={handleStatisticsClick}
                            onProfileClick={handleProfileClick}
                            onLogoutClick={handleLogoutClick}
                            userInitials={userInitials}
                            userAvatarUrl={userAvatarUrl}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
