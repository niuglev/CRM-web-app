import React, { useState, useRef, useEffect } from 'react';
import { FiBarChart2, FiLogOut, FiChevronDown, FiUser, FiSettings } from 'react-icons/fi';
import './UserDropdown.scss';

interface UserDropdownProps {
    userName: string;
    userInitials?: string;
    onStatisticsClick?: () => void;
    onLogoutClick?: () => void;
    onProfileClick?: () => void;
    onSettingsClick?: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
    userName,
    userInitials,
    onStatisticsClick,
    onLogoutClick,
    onProfileClick,
    onSettingsClick,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
                aria-label="Меню пользователя"
            >
                {userInitials && (
                    <div className="user-dropdown__avatar">
                        {userInitials}
                    </div>
                )}
                <span className="user-dropdown__name">{userName}</span>
                <FiChevronDown className={`user-dropdown__icon ${isOpen ? 'user-dropdown__icon--open' : ''}`} />
            </button>

            {isOpen && (
                <div className="user-dropdown__menu">
                    <div className="user-dropdown__header">
                        <div className="user-dropdown__header-avatar">
                            {userInitials}
                        </div>
                        <div className="user-dropdown__header-info">
                            <div className="user-dropdown__header-name">{userName}</div>
                            <div className="user-dropdown__header-status">В сети</div>
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
                        <span>Мой профиль</span>
                    </button>

                    <button
                        className="user-dropdown__item"
                        onClick={() => {
                            onSettingsClick?.();
                            setIsOpen(false);
                        }}
                    >
                        <FiSettings className="user-dropdown__item-icon" />
                        <span>Настройки</span>
                    </button>

                    <button
                        className="user-dropdown__item"
                        onClick={() => {
                            onStatisticsClick?.();
                            setIsOpen(false);
                        }}
                    >
                        <FiBarChart2 className="user-dropdown__item-icon" />
                        <span>Статистика</span>
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
                        <span>Выйти</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;