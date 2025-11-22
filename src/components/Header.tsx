import React, { useState, useEffect } from 'react';
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';
import './Header.scss';

export interface HeaderProps {
  userName: string;
  userInitials: string;
  isVisible?: boolean;
}

const Header: React.FC<HeaderProps> = ({ userName, userInitials, isVisible = true }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Проверяем начальную позицию скролла
    const checkScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''} ${!isVisible ? 'header--hidden' : ''}`}>
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

