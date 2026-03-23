import React from 'react';
import { FiUser, FiUsers, FiFileText, FiBarChart, FiSettings } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import './BottomNavigation.scss';

interface BottomNavigationProps {
    activeItem?: string;
    onMenuItemClick?: (itemId: string) => void;
    ordersCount?: number;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeItem, onMenuItemClick, ordersCount }) => {
    const { t } = useTranslation();

    const menuItems = [
        {
            id: 'clients',
            label: t('nav.clients'),
            icon: <FiUser />,
        },
        {
            id: 'executors',
            label: t('nav.executors'),
            icon: <FiUsers />,
        },
        {
            id: 'orders',
            label: t('nav.orders'),
            icon: <FiFileText />,
            badge: ordersCount,
        },
        {
            id: 'statistics',
            label: t('nav.statistics'),
            icon: <FiBarChart />,
        },
        {
            id: 'settings',
            label: t('nav.settings'),
            icon: <FiSettings />,
        },
    ];

    const handleItemClick = (e: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
        e.preventDefault();
        if (onMenuItemClick) {
            onMenuItemClick(itemId);
        }
    };

    return (
        <nav className="bottom-nav">
            {menuItems.map((item) => (
                <button
                    key={item.id}
                    className={`bottom-nav__item ${activeItem === item.id ? 'bottom-nav__item--active' : ''}`}
                    onClick={(e) => handleItemClick(e, item.id)}
                >
                    <span className="bottom-nav__icon">{item.icon}</span>
                    <span className="bottom-nav__label">{item.label}</span>
                    {!!item.badge && (
                        <span className="bottom-nav__badge">{item.badge}</span>
                    )}
                </button>
            ))}
        </nav>
    );
};

export default BottomNavigation;