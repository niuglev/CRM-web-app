import React, { useMemo, useState } from 'react';
import { FiPlus, FiSearch, FiCalendar, FiMapPin, FiUser, FiEdit3, FiTrash2 } from 'react-icons/fi';
import type { Order } from '../types';
import AddOrderModal from './AddOrderModal';
import './OrdersTableMobile.scss';

interface OrdersTableMobileProps {
  orders: Order[];
  clients?: Array<{ id: string; name: string }>;
  executors?: Array<{ id: string; name: string }>;
  onAddOrder?: (order: Omit<Order, 'id'>) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const OrdersTableMobile: React.FC<OrdersTableMobileProps> = ({ orders, clients = [], executors = [], onAddOrder, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return orders;
    }

    return orders.filter((order) =>
      [
        order.id,
        order.customerName,
        order.customerId,
        order.description,
        order.address,
        order.executorName,
        order.executorId,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [orders, searchQuery]);

  return (
    <div className="orders-table-mobile">
      <div className="orders-table-mobile__header">
        <h1 className="orders-table-mobile__title">Заказы</h1>
        <div className="orders-table-mobile__header-actions">
          <div className="orders-table-mobile__search">
            <FiSearch className="orders-table-mobile__search-icon" />
            <input
              type="search"
              placeholder="Поиск..."
              className="orders-table-mobile__search-input"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <button
            className="orders-table-mobile__btn orders-table-mobile__btn--primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FiPlus className="orders-table-mobile__btn-icon" />
            Заказ
          </button>
        </div>
      </div>

      <div className="orders-table-mobile__content">
        {filteredOrders.length === 0 ? (
          <div className="orders-table-mobile__empty">
            <div className="orders-table-mobile__empty-message">Заказы не найдены</div>
          </div>
        ) : (
          <div className="orders-table-mobile__list">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`orders-table-mobile__card ${selectedOrder === order.id ? 'orders-table-mobile__card--selected' : ''
                  }`}
                onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
              >
                <div className="orders-table-mobile__card-header">
                  <div className="orders-table-mobile__header-info">
                    <div className="orders-table-mobile__order-number">{order.id}</div>
                    <div className="orders-table-mobile__datetime">
                      <FiCalendar className="orders-table-mobile__datetime-icon" />
                      <span>{order.date}</span>
                      <span>{order.time}</span>
                    </div>
                  </div>
                  <div className="orders-table-mobile__actions">
                    <button
                      className="orders-table-mobile__action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(order);
                      }}
                      title="Редактировать"
                    >
                      <FiEdit3 />
                    </button>
                    <button
                      className="orders-table-mobile__action-btn orders-table-mobile__action-btn--delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(order);
                      }}
                      title="Удалить"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <div className="orders-table-mobile__card-body">
                  <div className="orders-table-mobile__field">
                    <FiUser className="orders-table-mobile__field-icon" />
                    <div className="orders-table-mobile__field-content">
                      <div className="orders-table-mobile__field-label">Заказчик</div>
                      <div className="orders-table-mobile__field-value">
                        {order.customerName} <span className="orders-table-mobile__field-id">id-{order.customerId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="orders-table-mobile__field">
                    <div className="orders-table-mobile__field-content">
                      <div className="orders-table-mobile__field-label">Описание</div>
                      <div className="orders-table-mobile__field-value">{order.description}</div>
                    </div>
                  </div>

                  <div className="orders-table-mobile__field">
                    <FiMapPin className="orders-table-mobile__field-icon" />
                    <div className="orders-table-mobile__field-content">
                      <div className="orders-table-mobile__field-label">Адрес</div>
                      <div className="orders-table-mobile__field-value">{order.address}</div>
                    </div>
                  </div>

                  <div className="orders-table-mobile__field">
                    <FiUser className="orders-table-mobile__field-icon" />
                    <div className="orders-table-mobile__field-content">
                      <div className="orders-table-mobile__field-label">Исполнитель</div>
                      <div className="orders-table-mobile__field-value">
                        {order.executorName} <span className="orders-table-mobile__field-id">id-{order.executorId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <AddOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(orderData) => {
          if (onAddOrder) {
            onAddOrder(orderData);
          }
        }}
        clients={clients}
        executors={executors}
      />
    </div>
  );
};

export default OrdersTableMobile;


