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
import type { Executor, Client, Order, User } from '../types';
import { dataApi } from '../api/services';
import { authApi } from '../api/auth';
import './ExecutorsPage.scss';

const MainPage: React.FC = () => {
  const isMobile = useMobile(768);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('executors');
  const mainContentRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  // Текущий пользователь
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Реальные данные исполнителей
  const [executors, setExecutors] = useState<Executor[]>([]);
  // Реальные данные клиентов
  const [clients, setClients] = useState<Client[]>([]);
  // Реальные данные заказов
  const [orders, setOrders] = useState<Order[]>([]);

  // Загрузка данных с бэкенда при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await authApi.getMe();
        setCurrentUser({
          name: user.full_name || user.username || 'Пользователь',
          initials: (user.full_name || user.username || 'U').substring(0, 2).toUpperCase()
        });
      } catch (err) {
        console.error("Error fetching current user:", err);
      }

      try {
        const [fetchedClients, fetchedOrders] = await Promise.all([
          dataApi.getClients(),
          dataApi.getOrders()
        ]);
        setClients(fetchedClients);
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching clients/orders:", err);
      }

      try {
        const fetchedExecutors = await dataApi.getExecutors();
        setExecutors(fetchedExecutors);
      } catch (err: any) {
        // Ошибка 403 означает, что мы не суперюзер - игнорируем ошибку и оставляем список пустым
        console.log("Not a superuser or unable to fetch executors", err?.response?.data || err.message);
      }
    };
    fetchData();
  }, []);

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

  const generateId = (prefix: string = '') => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}${timestamp}-${random}`;
  };

  const handleAddExecutor = async (executorData: Omit<Executor, 'id'>) => {
    // В текущем бэкенде добавление пользователя-админа требует спец прав
    // Здесь оставляем как было (пока мок-добавление для UI)
    const newExecutor: Executor = {
      ...executorData,
      id: generateId('exec-'),
    };
    setExecutors([...executors, newExecutor]);
  };

  const handleAddClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      const newBackendClient = await dataApi.addClient(clientData);
      const newClient: Client = {
        id: newBackendClient.id.toString(),
        name: `${newBackendClient.first_name || ''} ${newBackendClient.last_name || ''}`.trim() || 'Без имени',
        contacts: newBackendClient.email || newBackendClient.phone || '',
        comments: newBackendClient.position || newBackendClient.comments || ''
      };
      setClients([...clients, newClient]);
    } catch (e) {
      console.warn("Backend unavailable or error adding client, using mock data.", e);
      const newClient: Client = {
        ...clientData,
        id: generateId('client-'),
      };
      setClients([...clients, newClient]);
    }
  };

  const handleAddOrder = async (orderData: Omit<Order, 'id'> & { contacts?: string }) => {
    // If client is new, we auto-create it
    let finalCustomerId = orderData.customerId;
    let finalCustomerName = orderData.customerName;

    if (finalCustomerId === 'auto') {
      const newClientData = {
        name: orderData.customerName,
        contacts: orderData.contacts || '',
        comments: 'Добавлен автоматически при создании заказа'
      };

      try {
        const newBackendClient = await dataApi.addClient(newClientData);
        finalCustomerId = newBackendClient.id.toString();
        const newClient: Client = {
          id: finalCustomerId,
          name: `${newBackendClient.first_name || ''} ${newBackendClient.last_name || ''}`.trim() || 'Без имени',
          contacts: newBackendClient.email || newBackendClient.phone || '',
          comments: newBackendClient.position || newBackendClient.comments || 'Добавлен автоматически при создании заказа'
        };
        setClients(prev => [...prev, newClient]);
      } catch (e) {
        console.warn("Backend unavailable or error adding client inside order, using mock data.", e);
        finalCustomerId = generateId('client-');
        const newClient: Client = {
          ...newClientData,
          id: finalCustomerId,
        };
        setClients(prev => [...prev, newClient]);
      }
    }

    const orderPayload = {
      ...orderData,
      customerId: finalCustomerId,
      customerName: finalCustomerName
    };
    delete orderPayload.contacts;

    try {
      const newBackendDeal = await dataApi.addOrder(orderPayload);
      const dealDate = newBackendDeal.expected_close_date ? new Date(newBackendDeal.expected_close_date) : new Date();
      const newOrder: Order = {
        ...orderPayload,
        id: newBackendDeal.id.toString(),
        date: dealDate.toLocaleDateString(),
      };
      setOrders([...orders, newOrder]);
    } catch (e) {
      console.warn("Backend unavailable or error adding order, using mock data.", e);
      const newOrder: Order = {
        ...orderPayload,
        id: generateId('order-'),
      };
      setOrders([...orders, newOrder]);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.dispatchEvent(new Event('auth:unauthorized'));
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
        userName={currentUser?.name || "Пользователь"}
        userInitials={currentUser?.initials || "ПУ"}
        isVisible={isMobile ? true : isHeaderVisible}
        onLogoutClick={handleLogout}
      />
      <div className="executors-page__layout">
        {!isMobile && (
          <Sidebar
            activeItem={activeMenuItem}
            isCollapsed={isSidebarCollapsed}
            onToggle={toggleSidebar}
            onMenuItemClick={handleMenuItemClick}
            ordersCount={orders.length}
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
                  onAddClient={handleAddClient}
                />
              ) : (
                <ClientsTable
                  clients={clients}
                  onEdit={handleEditClient}
                  onView={handleViewClient}
                  onAddClient={handleAddClient}
                />
              )}
            </>
          ) : activeMenuItem === 'orders' ? (
            <>
              {isMobile ? (
                <OrdersTableMobile
                  orders={orders}
                  clients={clients.map(c => ({ id: c.id, name: c.name }))}
                  executors={executors.map(e => ({ id: e.id, name: e.name }))}
                  onAddOrder={handleAddOrder}
                />
              ) : (
                <OrdersTable
                  orders={orders}
                  clients={clients.map(c => ({ id: c.id, name: c.name }))}
                  executors={executors.map(e => ({ id: e.id, name: e.name }))}
                  onAddOrder={handleAddOrder}
                />
              )}
            </>
          ) : activeMenuItem === 'executors' ? (
            <>
              {isMobile ? (
                <ExecutorsTableMobile
                  executors={executors}
                  onEdit={handleEditExecutor}
                  onView={handleViewExecutor}
                  onAddExecutor={handleAddExecutor}
                />
              ) : (
                <ExecutorsTable
                  executors={executors}
                  onEdit={handleEditExecutor}
                  onView={handleViewExecutor}
                  onAddExecutor={handleAddExecutor}
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
          ordersCount={orders.length}
        />
      )}
      <div className="executors-page__decoration">
        <div className="executors-page__quarter-circle"></div>
        <div className="executors-page__white-arc"></div>
      </div>
    </div>
  );
};

export default MainPage;
