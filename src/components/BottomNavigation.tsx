import React from 'react';
import { FiUser, FiUsers, FiFileText, FiBarChart, FiSettings } from 'react-icons/fi';
import './BottomNavigation.scss';

interface BottomNavigationProps {
  activeItem?: string;
  onMenuItemClick?: (itemId: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeItem, onMenuItemClick }) => {
  const menuItems = [
    {
      id: 'clients',
      label: 'Клиенты',
      icon: <FiUser />,
    },
    {
      id: 'executors',
      label: 'Исполнители',
      icon: <FiUsers />,
    },
    {
      id: 'orders',
      label: 'Заказы',
      icon: <FiFileText />,
      badge: 24,
    },
    {
      id: 'statistics',
      label: 'Статистика',
      icon: <FiBarChart />,
    },
    {
      id: 'settings',
      label: 'Настройки',
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
          {item.badge && (
            <span className="bottom-nav__badge">{item.badge}</span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default BottomNavigation;


