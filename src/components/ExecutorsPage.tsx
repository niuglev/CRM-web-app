import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNavigation from './BottomNavigation';
import ExecutorsTable from './ExecutorsTable';
import ExecutorsTableMobile from './ExecutorsTableMobile';
import OrdersTable from './OrdersTable';
import OrdersTableMobile from './OrdersTableMobile';
import ClientsTable from './ClientsTable';
import ClientsTableMobile from './ClientsTableMobile';
import useMobile from '../hooks/useMobile';
import type { Executor, Client, Order } from '../types';
import './ExecutorsPage.scss';

const MainPage: React.FC = () => {
  const isMobile = useMobile(768);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('executors');
  const mainContentRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  // Моковые данные исполнителей
  const executors: Executor[] = [
    {
      id: '005',
      name: 'Имя Фамилия',
      contacts: '(29) 123-4567',
      comments: 'Компания 1. Связной Имя Фамилия - вредный чувак'
    },
    {
      id: '001',
      name: 'Имя Фамилия',
      contacts: 'wa(391) 123-4567',
      comments: 'Компания 1. Связной Имя Фамилия - вредный чувак'
    },
    {
      id: '002',
      name: 'Имя Фамилия',
      contacts: 'imya@mail.ru',
      comments: 'Компания 1. Связной Имя Фамилия - вредный чувак'
    },
    {
      id: '003',
      name: 'Имя Фамилия',
      contacts: 'lg.user01',
      comments: 'Компания 1. Связной Имя Фамилия - вредный чувак'
    },
    {
      id: '004',
      name: 'Имя Фамилия',
      contacts: '(29) 123-4567',
      comments: 'Компания 1. Связной Имя Фамилия - вредный чувак'
    }
  ];

  // Моковые данные клиентов
  const clients: Client[] = [
    {
      id: '005-Компания 1',
      name: 'Имя Фамилия',
      contacts: '12041123-4587',
      comments: 'Компания 1. Саконой Имя Фимания - продный чупак'
    },
    {
      id: '001',
      name: 'Имя Фамилия',
      contacts: 'nsd391123-4567',
      comments: 'Компания 1. Саконой Имя Фимания - продный чупак'
    },
    {
      id: '002',
      name: 'Имя Фамилия',
      contacts: 'irya@mail.ru',
      comments: 'Компания 1. Саконой Имя Фимания - продный чупак'
    },
    {
      id: '003',
      name: 'Имя Фамилия',
      contacts: '139123-45602',
      comments: 'Компания 1. Саконой Имя Фимания - продный чупак'
    },
    {
      id: '004-Компания 2',
      name: 'Имя Фамилия',
      contacts: 'tg.usr01',
      comments: 'Компания 1. Саконой Имя Фимания - продный чупак'
    }
  ];

  // Моковые данные заказов
  const orders: Order[] = [
    {
      id: 'ord-001',
      date: '09.05.25',
      time: '07:00',
      customerName: 'Имя заказчика',
      customerId: 'ID',
      description: 'Первый заказ компании Урал',
      address: 'г. Пушкино, ул. Колхозная, д. 42',
      executorName: 'Имя Фамилия',
      executorId: 'ID',
    },
    {
      id: 'ord-002',
      date: '10.05.25',
      time: '13:30',
      customerName: 'Имя заказчика',
      customerId: 'ID',
      description: 'Второй заказ компании Урал',
      address: 'г. Екатеринбург, ул. Ленина, 10',
      executorName: 'Имя Фамилия',
      executorId: 'ID',
    },
    {
      id: 'ord-003',
      date: '12.05.25',
      time: '09:15',
      customerName: 'Имя заказчика',
      customerId: 'ID',
      description: 'Монтаж оборудования, этап 1',
      address: 'г. Казань, ул. Советская, 7',
      executorName: 'Имя Фамилия',
      executorId: 'ID',
    },
    {
      id: 'ord-004',
      date: '15.05.25',
      time: '16:45',
      customerName: 'Имя заказчика',
      customerId: 'ID',
      description: 'Диагностика и обслуживание',
      address: 'г. Пушкино, ул. Колхозная, д. 42',
      executorName: 'Имя Фамилия',
      executorId: 'ID',
    },
  ];

  const handleEditExecutor = (executor: Executor) => {
    console.log('Редактировать исполнителя:', executor);
    // Здесь будет логика редактирования
  };

  const handleViewExecutor = (executor: Executor) => {
    console.log('Просмотр исполнителя:', executor);
    // Здесь будет логика просмотра
  };

  const handleEditClient = (client: Client) => {
    console.log('Редактировать клиента:', client);
    // Здесь будет логика редактирования
  };

  const handleViewClient = (client: Client) => {
    console.log('Просмотр клиента:', client);
    // Здесь будет логика просмотра
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMenuItemClick = (itemId: string) => {
    setActiveMenuItem(itemId);
  };

  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;

    const handleScroll = () => {
      const currentScrollY = mainContent.scrollTop;

      // Скрываем header при прокрутке вниз, показываем при прокрутке вверх
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    mainContent.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainContent.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`executors-page ${isMobile ? 'executors-page--mobile' : ''}`}>
      <Header 
        userName="Имя Фамилия" 
        userInitials="ИФ" 
        isVisible={isMobile ? true : isHeaderVisible} 
      />
      <div className="executors-page__layout">
        {!isMobile && (
          <Sidebar 
            activeItem={activeMenuItem}
            isCollapsed={isSidebarCollapsed}
            onToggle={toggleSidebar}
            onMenuItemClick={handleMenuItemClick}
          />
        )}
        <main 
          ref={mainContentRef}
          className={`executors-page__main ${isSidebarCollapsed && !isMobile ? 'executors-page__main--sidebar-collapsed' : ''} ${isMobile ? 'executors-page__main--mobile' : ''}`}
        >
          {activeMenuItem === 'clients' ? (
            <>
              {isMobile ? (
                <ClientsTableMobile 
                  clients={clients}
                  onEdit={handleEditClient}
                  onView={handleViewClient}
                />
              ) : (
                <ClientsTable 
                  clients={clients}
                  onEdit={handleEditClient}
                  onView={handleViewClient}
                />
              )}
            </>
          ) : activeMenuItem === 'orders' ? (
            <>
              {isMobile ? (
                <OrdersTableMobile orders={orders} />
              ) : (
                <OrdersTable orders={orders} />
              )}
            </>
          ) : activeMenuItem === 'executors' ? (
            <>
              {isMobile ? (
                <ExecutorsTableMobile 
                  executors={executors}
                  onEdit={handleEditExecutor}
                  onView={handleViewExecutor}
                />
              ) : (
                <ExecutorsTable 
                  executors={executors}
                  onEdit={handleEditExecutor}
                  onView={handleViewExecutor}
                />
              )}
            </>
          ) : null}
        </main>
      </div>
      {isMobile && (
        <BottomNavigation 
          activeItem={activeMenuItem}
          onMenuItemClick={handleMenuItemClick}
        />
      )}
      {!isMobile && (
        <div className="executors-page__decoration">
          <div className="executors-page__circles">
            <div className="executors-page__circle executors-page__circle--1"></div>
            <div className="executors-page__circle executors-page__circle--2"></div>
            <div className="executors-page__circle executors-page__circle--3"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
