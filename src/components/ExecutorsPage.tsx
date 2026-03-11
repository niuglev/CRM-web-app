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

import AddClientModal from './AddClientModal';
import AddExecutorModal from './AddExecutorModal';
import AddOrderModal from './AddOrderModal';

const MainPage: React.FC = () => {
  const isMobile = useMobile(768);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('executors');
  const mainContentRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  // Состояние редактирования
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingExecutor, setEditingExecutor] = useState<Executor | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Текущий пользователь
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
      } catch (err: any) {
        // Ошибка 403 означает, что мы не суперюзер - игнорируем ошибку и оставляем список пустым
        console.log("Not a superuser or unable to fetch executors", err?.response?.data || err.message);
      }
    };
    fetchData();
  }, []);

  const handleEditExecutor = (executor: Executor) => {
    setEditingExecutor(executor);
    // Modal will be opened internally by the table using its own state,
    // but we can also manage it here in a real app. Let's assume the table modals
    // handle their own "isAddModalOpen" but we can't easily force it open from here
    // without lifting `isAddModalOpen` state up.
    // Ah, wait! The tables have their own `isAddModalOpen`. If we click Edit, the table
    // does not open the modal directly! So the edit button click currently does NOT open the modal.
    // Let's change the pattern: we will lift the modal state up to the page level.
  };

  const handleDeleteExecutor = (executor: Executor) => {
    if (window.confirm(`Вы уверены, что хотите удалить исполнителя ${executor.name}?`)) {
      setExecutors(prev => prev.filter(e => e.id !== executor.id));
    }
  };

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

  const handleAddExecutor = async (executorData: Omit<Executor, 'id'>) => {
    if (editingExecutor) {
      setExecutors(prev => prev.map(e => e.id === editingExecutor.id ? { ...executorData, id: editingExecutor.id } : e));
      setEditingExecutor(null);
    } else {
      const newExecutor: Executor = {
        ...executorData,
        id: generateId('exec-'),
      };
      setExecutors(prev => [...prev, newExecutor]);
    }
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
      const updatedOrder = { ...orderData, id: editingOrder.id } as Order;
      delete (updatedOrder as any).customerContacts;
      delete (updatedOrder as any).executorContacts;
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
    let finalCustomerName = orderData.customerName;

    if (finalCustomerId === 'auto' || !finalCustomerId) {
      const newClientData = {
        name: orderData.customerName,
        contacts: orderData.customerContacts || '',
        comments: 'Добавлен автоматически при создании заказа'
      };

      try {
        const newBackendClient = await dataApi.addClient(newClientData);
        finalCustomerId = newBackendClient.id.toString();
        const newClient: Client = {
          id: finalCustomerId,
          name: `${newBackendClient.first_name || ''} ${newBackendClient.last_name || ''}`.trim() || 'Без имени',
          contacts: newBackendClient.email || newBackendClient.phone || '',
          comments: newBackendClient.notes || newBackendClient.job_title || 'Добавлен автоматически при создании заказа'
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
    let finalExecutorName = orderData.executorName;

    if ((finalExecutorId === 'auto' || !finalExecutorId) && finalExecutorName && finalExecutorName !== 'Не назначен') {
      const newExecutorData = {
        name: finalExecutorName,
        contacts: orderData.executorContacts || '',
        comments: 'Добавлен автоматически при создании заказа'
      };

      try {
        const newBackendExec = await dataApi.addExecutor(newExecutorData);
        finalExecutorId = newBackendExec.id.toString();
        const newExecutor: Executor = {
          id: finalExecutorId,
          name: `${newBackendExec.first_name || ''} ${newBackendExec.last_name || ''}`.trim() || newBackendExec.username || 'Без имени',
          contacts: newBackendExec.email || '',
          comments: newBackendExec.phone || 'Добавлен автоматически при создании заказа'
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
                />
              )}
            </>
          ) : activeMenuItem === 'executors' ? (
            <>
              {isMobile ? (
                <ExecutorsTableMobile
                  executors={executors}
                  onEdit={handleEditExecutor}
                  onView={() => { }}
                  onDelete={handleDeleteExecutor}
                  onAddExecutor={handleAddExecutor}
                />
              ) : (
                <ExecutorsTable
                  executors={executors}
                  onEdit={handleEditExecutor}
                  onView={() => { }}
                  onDelete={handleDeleteExecutor}
                  onAddExecutor={handleAddExecutor}
                />
              )}
            </>
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
      {editingExecutor && (
        <AddExecutorModal
          isOpen={true}
          onClose={() => setEditingExecutor(null)}
          onSubmit={handleAddExecutor}
          initialData={editingExecutor}
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
