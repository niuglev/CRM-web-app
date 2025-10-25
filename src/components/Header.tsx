import React from 'react';
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';
import './Header.scss';

interface HeaderProps {
  userName: string;
  userInitials: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userInitials }) => {
  return (
    <header className="header">
      <div className="header__top">
        <span className="header__version">Desktop - Employee v.01</span>
      </div>
      <div className="header__main">
        <div className="header__left">
          <h1 className="header__logo">KP-CRM</h1>
        </div>
        <div className="header__center">
          <div className="header__search">
            <FiSearch className="header__search-icon" />
            <input 
              type="text" 
              placeholder="Найдите клиента или заказ..." 
              className="header__search-input"
            />
          </div>
        </div>
        <div className="header__right">
          <FiBell className="header__bell" />
          <div className="header__user">
            <div className="header__user-avatar">
              {userInitials}
            </div>
            <span className="header__user-name">{userName}</span>
            <FiChevronDown className="header__user-chevron" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
