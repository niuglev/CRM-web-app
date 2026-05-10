import React, { useState, useRef, useEffect } from 'react';
import { FiBarChart2, FiLogOut, FiChevronDown, FiUser, FiSettings } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import './UserDropdown.scss';

interface UserDropdownProps {
    userName: string;
    userInitials?: string;
    userAvatarUrl?: string | null;
    onStatisticsClick?: () => void;
    onLogoutClick?: () => void;
    onProfileClick?: () => void;
    onSettingsClick?: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
    userName,
    userInitials,
    userAvatarUrl,
    onStatisticsClick,
    onLogoutClick,
    onProfileClick,
    onSettingsClick,
}) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [avatarFailed, setAvatarFailed] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setAvatarFailed(false);
    }, [userAvatarUrl]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="user-dropdown" ref={dropdownRef}>
            <button
                className="user-dropdown__trigger"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
                aria-label={t('userDropdown.ariaLabel')}
            >
                <div className="user-dropdown__avatar">
                    {userAvatarUrl && !avatarFailed ? (
                        <img
                            src={userAvatarUrl}
                            alt={userName}
                            className="user-dropdown__avatar-image"
                            onError={() => setAvatarFailed(true)}
                        />
                    ) : (
                        userInitials
                    )}
                </div>
                <span className="user-dropdown__name">{userName}</span>
                <FiChevronDown className={`user-dropdown__icon ${isOpen ? 'user-dropdown__icon--open' : ''}`} />
            </button>

            {isOpen && (
                <div className="user-dropdown__menu">
                    <div className="user-dropdown__header">
                        <div className="user-dropdown__header-avatar">
                            {userAvatarUrl && !avatarFailed ? (
                                <img
                                    src={userAvatarUrl}
                                    alt={userName}
                                    className="user-dropdown__avatar-image"
                                    onError={() => setAvatarFailed(true)}
                                />
                            ) : (
                                userInitials
                            )}
                        </div>
                        <div className="user-dropdown__header-info">
                            <div className="user-dropdown__header-name">{userName}</div>
                            <div className="user-dropdown__header-status">{t('userDropdown.onlineStatus')}</div>
                        </div>
                    </div>

                    <div className="user-dropdown__divider" />

                    <button
                        className="user-dropdown__item"
                        onClick={() => {
                            onProfileClick?.();
                            setIsOpen(false);
                        }}
                    >
                        <FiUser className="user-dropdown__item-icon" />
                        <span>{t('userDropdown.myProfile')}</span>
                    </button>

                    <button
                        className="user-dropdown__item"
                        onClick={() => {
                            onSettingsClick?.();
                            setIsOpen(false);
                        }}
                    >
                        <FiSettings className="user-dropdown__item-icon" />
                        <span>{t('userDropdown.settings')}</span>
                    </button>

                    <button
                        className="user-dropdown__item"
                        onClick={() => {
                            onStatisticsClick?.();
                            setIsOpen(false);
                        }}
                    >
                        <FiBarChart2 className="user-dropdown__item-icon" />
                        <span>{t('userDropdown.statistics')}</span>
                    </button>

                    <div className="user-dropdown__divider" />

                    <button
                        className="user-dropdown__item user-dropdown__item--logout"
                        onClick={() => {
                            onLogoutClick?.();
                            setIsOpen(false);
                        }}
                    >
                        <FiLogOut className="user-dropdown__item-icon" />
                        <span>{t('userDropdown.logout')}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;