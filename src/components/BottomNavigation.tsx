import React from 'react';
import { FiUser, FiFileText, FiBarChart, FiSettings, FiShield } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import './BottomNavigation.scss';

interface BottomNavigationProps {
    activeItem?: string;
    onMenuItemClick?: (itemId: string) => void;
    ordersCount?: number;
    isAdmin?: boolean;
}

interface BottomNavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeItem, onMenuItemClick, ordersCount, isAdmin = false }) => {
    const { t } = useTranslation();

    const baseItems: BottomNavItem[] = [
        {
            id: 'clients',
            label: t('nav.clients'),
            icon: <FiUser />,
        },
        {
            id: 'orders',
            label: t('nav.orders'),
            icon: <FiFileText />,
            badge: ordersCount,
        },
        {
            id: 'admin-users',
            label: t('nav.adminUsers'),
            icon: <FiShield />,
        },
        {
            id: 'table-settings',
            label: t('nav.tableSettings'),
            icon: <FiSettings />,
        },
    ];

    const adminItems: BottomNavItem[] = isAdmin
        ? [
            {
                id: 'finance',
                label: t('nav.finance'),
                icon: <FiBarChart />,
            },
        ]
        : [];

    const menuItems = [...baseItems, ...adminItems];

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