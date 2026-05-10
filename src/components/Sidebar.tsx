import React from 'react';
import { FiUser, FiFileText, FiBarChart, FiSettings, FiMenu, FiX, FiShield } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
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
  isCollapsed?: boolean;
  onToggle?: () => void;
  onMenuItemClick?: (itemId: string) => void;
  ordersCount?: number;
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, isCollapsed = false, onToggle, onMenuItemClick, ordersCount, isAdmin = false }) => {
  const { t } = useTranslation();

  const baseItems: SidebarItem[] = [
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

  const adminItems: SidebarItem[] = isAdmin
    ? [
        {
          id: 'finance',
          label: t('nav.finance'),
          icon: <FiBarChart />,
        },
      ]
    : [];

  const menuItems = [...baseItems, ...adminItems];

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, itemId: string) => {
    e.preventDefault();
    if (onMenuItemClick) {
      onMenuItemClick(itemId);
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      <button
        className="sidebar__toggle"
        onClick={onToggle}
        aria-label={isCollapsed ? t('sidebar.expandMenu') : t('sidebar.collapseMenu')}
        title={isCollapsed ? t('sidebar.expandMenu') : t('sidebar.collapseMenu')}
      >
        {isCollapsed ? <FiMenu /> : <FiX />}
      </button>
      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {menuItems.map((item) => (
            <li key={item.id} className="sidebar__item">
              <a
                href={`#${item.id}`}
                className={`sidebar__link ${activeItem === item.id ? 'sidebar__link--active' : ''} ${isCollapsed ? 'sidebar__link--collapsed' : ''}`}
                title={isCollapsed ? item.label : undefined}
                onClick={(e) => handleItemClick(e, item.id)}
              >
                <span className="sidebar__icon">{item.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="sidebar__label">{item.label}</span>
                    {!!item.badge && (
                      <span className="sidebar__badge">{item.badge}</span>
                    )}
                  </>
                )}
                {isCollapsed && !!item.badge && (
                  <span className="sidebar__badge sidebar__badge--collapsed">{item.badge}</span>
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
