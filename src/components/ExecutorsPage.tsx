import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNavigation from './BottomNavigation';
import OrdersTable from './OrdersTable';
import OrdersTableMobile from './OrdersTableMobile';
import ClientsTable from './ClientsTable';
import ClientsTableMobile from './ClientsTableMobile';
import useMobile from '../hooks/useMobile';
import type { Executor, Client, Order, User } from '../types';
import { dataApi } from '../api/services';
import { authApi } from '../api/auth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './ExecutorsPage.scss';

import AddClientModal from './AddClientModal';
import AddOrderModal from './AddOrderModal';
import AdminUserManagement from './AdminUserManagement';
import TableSettingsPage from './TableSettingsPage';
import { defaultTableViewSettings, mapSettingsToView, type TableViewSettings } from './tableViewSettings';
import FinancePage from './FinancePage';

type HttpError = {
  response?: {
    data?: unknown;
  };
  message?: string;
};

const MainPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMobile(768);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('admin-users');
  const mainContentRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  // Состояние редактирования
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Текущий пользователь
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tableViewSettings, setTableViewSettings] = useState<TableViewSettings>(defaultTableViewSettings);
  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/api\/v1\/?$/, '');

  // Реальные данные исполнителей
  const [executors, setExecutors] = useState<Executor[]>(() => {
    const saved = localStorage.getItem('crm_executors');
    return saved ? JSON.parse(saved) : [];
  });
  // Реальные данные клиентов
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('crm_clients');
    return saved ? JSON.parse(saved) : [];
  });
  // Реальные данные заказов
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('crm_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('crm_executors', JSON.stringify(executors));
  }, [executors]);

  useEffect(() => {
    localStorage.setItem('crm_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('crm_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (!currentUser?.id) {
      setTableViewSettings(defaultTableViewSettings);
      return;
    }
    const key = `crm_table_settings_${currentUser.id}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      setTableViewSettings(defaultTableViewSettings);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Array<{ id: string; enabled: boolean; titleKey: string }>;
      setTableViewSettings(mapSettingsToView(parsed));
    } catch {
      setTableViewSettings(defaultTableViewSettings);
    }
  }, [currentUser?.id]);

  // Загрузка данных с бэкенда при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await authApi.getMe();
        const avatarUrl = user.avatar_url
          ? (user.avatar_url.startsWith('http') ? user.avatar_url : `${apiBase}${user.avatar_url}`)
          : null;
        setCurrentUser({
          id: String(user.id),
          name: user.full_name || user.username || t('profile.defaultName'),
          initials: (user.full_name || user.username || 'U').substring(0, 2).toUpperCase(),
          avatarUrl,
          isSuperuser: Boolean(user.is_superuser),
        });
      } catch (err) {
        console.error("Error fetching current user:", err);
      }

      try {
        const [fetchedClients, fetchedOrders] = await Promise.all([
          dataApi.getClients(),
          dataApi.getOrders()
        ]);
        setClients(prev => {
          const localItems = prev.filter(c => isNaN(Number(c.id)));
          const backendIds = new Set(fetchedClients.map((c: Client) => c.id));
          // Filter out any local items that might have been synced but not removed, though local items shouldn't have number IDs
          return [...fetchedClients, ...localItems.filter((c: Client) => !backendIds.has(c.id))];
        });
        setOrders(prev => {
          const localItems = prev.filter(o => isNaN(Number(o.id)));
          const backendIds = new Set(fetchedOrders.map((o: Order) => o.id));
          return [...fetchedOrders, ...localItems.filter((o: Order) => !backendIds.has(o.id))];
        });
      } catch (err) {
        console.error("Error fetching clients/orders:", err);
      }

      try {
        const fetchedExecutors = await dataApi.getExecutors();
        setExecutors(prev => {
          const localItems = prev.filter(e => isNaN(Number(e.id)));
          const backendIds = new Set(fetchedExecutors.map((e: Executor) => e.id));
          return [...fetchedExecutors, ...localItems.filter((e: Executor) => !backendIds.has(e.id))];
        });
      } catch (err: unknown) {
        // Ошибка 403 означает, что мы не суперюзер - игнорируем ошибку и оставляем список пустым
        const httpError = err as HttpError;
        console.log("Not a superuser or unable to fetch executors", httpError.response?.data || httpError.message);
      }
    };
    fetchData();
  }, [t]);

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
  };

  const handleDeleteClient = async (client: Client) => {
    if (window.confirm(`Вы уверены, что хотите удалить клиента ${client.name}?`)) {
      setClients(prev => prev.filter(c => c.id !== client.id));
      try {
        if (!isNaN(Number(client.id))) {
          await dataApi.deleteClient(client.id);
        }
      } catch (e) {
        console.error("Failed to delete client on backend", e);
      }
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
  };

  const handleDeleteOrder = async (order: Order) => {
    if (window.confirm(`Вы уверены, что хотите удалить заказ №${order.id}?`)) {
      setOrders(prev => prev.filter(o => o.id !== order.id));
      try {
        if (!isNaN(Number(order.id))) {
          await dataApi.deleteOrder(order.id);
        }
      } catch (e) {
        console.error("Failed to delete order on backend", e);
      }
    }
  };

  const generateId = (prefix: string = '') => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}${timestamp}-${random}`;
  };

  const handleAddClient = async (clientData: Omit<Client, 'id'>) => {
    if (editingClient) {
      const updatedClient = { ...clientData, id: editingClient.id } as Client;
      setClients(prev => prev.map(c => c.id === editingClient.id ? updatedClient : c));
      setEditingClient(null);

      try {
        if (!isNaN(Number(editingClient.id))) {
          await dataApi.updateClient(editingClient.id, clientData);
        }
      } catch (e) {
        console.error("Failed to update client on backend", e);
      }
      return;
    }

    try {
      const newBackendClient = await dataApi.addClient(clientData);
      const newClient: Client = {
        id: newBackendClient.id.toString(),
        name: `${newBackendClient.first_name || ''} ${newBackendClient.last_name || ''}`.trim() || 'Без имени',
        contacts: newBackendClient.email || newBackendClient.phone || '',
        comments: newBackendClient.notes || newBackendClient.job_title || ''
      };
      setClients(prev => [...prev, newClient]);
    } catch (e) {
      console.warn("Backend unavailable or error adding client, using mock data.", e);
      const newClient: Client = {
        ...clientData,
        id: generateId('client-'),
      };
      setClients(prev => [...prev, newClient]);
    }
  };

  const handleAddOrder = async (orderData: Omit<Order, 'id'> & { customerContacts?: string; executorContacts?: string }) => {
    if (editingOrder) {
      // Editing Mode
      const updatedOrder: Order = {
        id: editingOrder.id,
        date: orderData.date,
        time: orderData.time,
        customerId: orderData.customerId,
        customerName: orderData.customerName,
        description: orderData.description,
        address: orderData.address,
        executorId: orderData.executorId,
        executorName: orderData.executorName,
      };
      setOrders(prev => prev.map(o => o.id === editingOrder.id ? updatedOrder : o));
      setEditingOrder(null);

      try {
        if (!isNaN(Number(editingOrder.id))) {
          await dataApi.updateOrder(editingOrder.id, orderData);
        }
      } catch (e) {
        console.error("Failed to update order on backend", e);
      }
      return;
    }

    // Add Mode
    let finalCustomerId = orderData.customerId;
    const finalCustomerName = orderData.customerName;

    if (finalCustomerId === 'auto' || !finalCustomerId) {
      const newClientData = {
        name: orderData.customerName,
        contacts: orderData.customerContacts || '',
        comments: t('orders.autoAddedComment')
      };

      try {
        const newBackendClient = await dataApi.addClient(newClientData);
        finalCustomerId = newBackendClient.id.toString();
        const newClient: Client = {
          id: finalCustomerId,
          name: `${newBackendClient.first_name || ''} ${newBackendClient.last_name || ''}`.trim() || 'Без имени',
          contacts: newBackendClient.email || newBackendClient.phone || '',
          comments: newBackendClient.notes || newBackendClient.job_title || t('orders.autoAddedComment')
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

    let finalExecutorId = orderData.executorId;
    const finalExecutorName = orderData.executorName;

    if ((finalExecutorId === 'auto' || !finalExecutorId) && finalExecutorName && finalExecutorName !== 'Не назначен') {
      const newExecutorData = {
        name: finalExecutorName,
        contacts: orderData.executorContacts || '',
        comments: t('orders.autoAddedComment')
      };

      try {
        const newBackendExec = await dataApi.addExecutor(newExecutorData);
        finalExecutorId = newBackendExec.id.toString();
        const newExecutor: Executor = {
          id: finalExecutorId,
          name: `${newBackendExec.first_name || ''} ${newBackendExec.last_name || ''}`.trim() || newBackendExec.username || 'Без имени',
          contacts: newBackendExec.email || '',
          comments: newBackendExec.phone || t('orders.autoAddedComment')
        };
        setExecutors(prev => [...prev, newExecutor]);
      } catch (e) {
        console.warn("Backend unavailable or error adding executor inside order, using mock data.", e);
        finalExecutorId = generateId('exec-');
        const newExecutor: Executor = {
          ...newExecutorData,
          id: finalExecutorId,
        };
        setExecutors(prev => [...prev, newExecutor]);
      }
    }

    const orderPayload = {
      ...orderData,
      customerId: finalCustomerId,
      customerName: finalCustomerName,
      executorId: finalExecutorId,
      executorName: finalExecutorName
    };
    delete orderPayload.customerContacts;
    delete orderPayload.executorContacts;

    try {
      const newBackendDeal = await dataApi.addOrder(orderPayload);
      const dealDate = newBackendDeal.expected_close_date ? new Date(newBackendDeal.expected_close_date) : new Date();
      const newOrder: Order = {
        ...orderPayload,
        id: newBackendDeal.id.toString(),
        date: dealDate.toLocaleDateString(),
      };
      setOrders(prev => [...prev, newOrder]);
    } catch (e) {
      console.warn("Backend unavailable or error adding order, using mock data.", e);
      const newOrder: Order = {
        ...orderPayload,
        id: generateId('order-'),
      };
      setOrders(prev => [...prev, newOrder]);
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
        userName={currentUser?.name || t('profile.defaultName')}
        userInitials={currentUser?.initials || "ПУ"}
        userAvatarUrl={currentUser?.avatarUrl || null}
        isVisible={isMobile ? true : isHeaderVisible}
        onProfileClick={() => navigate('/profile')}
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
            isAdmin={Boolean(currentUser?.isSuperuser)}
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
                  onView={() => { }}
                  onDelete={handleDeleteClient}
                  onAddClient={handleAddClient}
                />
              ) : (
                <ClientsTable
                  clients={clients}
                  onEdit={handleEditClient}
                  onView={() => { }}
                  onDelete={handleDeleteClient}
                  onAddClient={handleAddClient}
                  showContacts={tableViewSettings.showContacts}
                  compactMode={tableViewSettings.compactMode}
                  stickyHeader={tableViewSettings.stickyHeader}
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
                  onEdit={handleEditOrder}
                  onDelete={handleDeleteOrder}
                />
              ) : (
                <OrdersTable
                  orders={orders}
                  clients={clients.map(c => ({ id: c.id, name: c.name }))}
                  executors={executors.map(e => ({ id: e.id, name: e.name }))}
                  onAddOrder={handleAddOrder}
                  onEdit={handleEditOrder}
                  onDelete={handleDeleteOrder}
                  compactMode={tableViewSettings.compactMode}
                  stickyHeader={tableViewSettings.stickyHeader}
                />
              )}
            </>
          ) : activeMenuItem === 'admin-users' ? (
            <AdminUserManagement
              isSuperuser={Boolean(currentUser?.isSuperuser)}
              showEmail={tableViewSettings.showEmail}
              showContacts={tableViewSettings.showContacts}
              compactMode={tableViewSettings.compactMode}
              stickyHeader={tableViewSettings.stickyHeader}
            />
          ) : activeMenuItem === 'table-settings' ? (
            <TableSettingsPage
              userId={currentUser?.id || 'anonymous'}
              onSettingsChange={(next) => setTableViewSettings(next)}
            />
          ) : activeMenuItem === 'finance' && currentUser?.isSuperuser ? (
            <FinancePage />
          ) : null}
        </main>
      </div>
      {/* Модальные окна для редактирования */}
      {editingClient && (
        <AddClientModal
          isOpen={true}
          onClose={() => setEditingClient(null)}
          onSubmit={handleAddClient}
          initialData={editingClient}
        />
      )}
      {editingOrder && (
        <AddOrderModal
          isOpen={true}
          onClose={() => setEditingOrder(null)}
          onSubmit={handleAddOrder}
          initialData={editingOrder}
          clients={clients.map(c => ({ id: c.id, name: c.name }))}
          executors={executors.map(e => ({ id: e.id, name: e.name }))}
        />
      )}
      {isMobile && (
        <BottomNavigation
          activeItem={activeMenuItem}
          onMenuItemClick={handleMenuItemClick}
          ordersCount={orders.length}
          isAdmin={Boolean(currentUser?.isSuperuser)}
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
