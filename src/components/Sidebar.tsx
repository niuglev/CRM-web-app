import React from 'react';
import { FiUser, FiUsers, FiFileText, FiBarChart, FiSettings } from 'react-icons/fi';
import './Sidebar.scss';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  isActive?: boolean;
}

interface SidebarProps {
  activeItem?: string;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const menuItems: SidebarItem[] = [
    {
      id: 'clients',
      label: 'Клиенты',
      icon: <FiUser />,
    },
    {
      id: 'executors',
      label: 'Исполнители',
      icon: <FiUsers />,
      isActive: true,
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

  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {menuItems.map((item) => (
            <li key={item.id} className="sidebar__item">
              <a
                href={`#${item.id}`}
                className={`sidebar__link ${item.isActive ? 'sidebar__link--active' : ''}`}
              >
                <span className="sidebar__icon">{item.icon}</span>
                <span className="sidebar__label">{item.label}</span>
                {item.badge && (
                  <span className="sidebar__badge">{item.badge}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
