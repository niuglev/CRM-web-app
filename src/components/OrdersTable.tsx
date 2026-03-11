import React, { useMemo, useState } from 'react';
import { FiPlus, FiSearch, FiEdit3, FiTrash2 } from 'react-icons/fi';
import type { Order } from '../types';
import AddOrderModal from './AddOrderModal';
import './OrdersTable.scss';

interface OrdersTableProps {
  orders: Order[];
  clients?: Array<{ id: string; name: string }>;
  executors?: Array<{ id: string; name: string }>;
  onAddOrder?: (order: Omit<Order, 'id'>) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, clients = [], executors = [], onAddOrder, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(orders[0]?.id ?? null);
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
    <div className="orders-table">
      <div className="orders-table__header">
        <div>
          <h1 className="orders-table__title">Заказы</h1>
        </div>
        <div className="orders-table__header-actions">
          <div className="orders-table__search">
            <FiSearch className="orders-table__search-icon" />
            <input
              type="search"
              placeholder="Найдите клиента или заказ..."
              className="orders-table__search-input"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <button
            className="orders-table__btn orders-table__btn--primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FiPlus className="orders-table__btn-icon" />
            Заказ
          </button>
        </div>
      </div>

      <div className="orders-table__content">
        <table className="orders-table__table">
          <thead>
            <tr className="orders-table__header-row">
              <th className="orders-table__header-cell">Номер заказа</th>
              <th className="orders-table__header-cell">Дата / Время</th>
              <th className="orders-table__header-cell">Заказчик</th>
              <th className="orders-table__header-cell">Описание заказа</th>
              <th className="orders-table__header-cell">Адрес</th>
              <th className="orders-table__header-cell">Исполнитель</th>
              <th className="orders-table__header-cell orders-table__header-cell--actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="orders-table__empty">
                  <div className="orders-table__empty-message">Заказы не найдены</div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`orders-table__row ${selectedOrder === order.id ? 'orders-table__row--selected' : ''
                    }`}
                  onClick={() => setSelectedOrder(order.id)}
                >
                  <td className="orders-table__cell">
                    <div className="orders-table__order-number">{order.id}</div>
                  </td>
                  <td className="orders-table__cell">
                    <div className="orders-table__datetime">
                      <span>{order.date}</span>
                      <span>{order.time}</span>
                    </div>
                  </td>
                  <td className="orders-table__cell">
                    <div className="orders-table__person">
                      <div className="orders-table__person-name">{order.customerName}</div>
                      <div className="orders-table__person-id">id-{order.customerId}</div>
                    </div>
                  </td>
                  <td className="orders-table__cell">
                    <div className="orders-table__description" title={order.description}>
                      {order.description}
                    </div>
                  </td>
                  <td className="orders-table__cell">
                    <div className="orders-table__address" title={order.address}>
                      {order.address}
                    </div>
                  </td>
                  <td className="orders-table__cell">
                    <div className="orders-table__person">
                      <div className="orders-table__person-name">{order.executorName}</div>
                      <div className="orders-table__person-id">id-{order.executorId}</div>
                    </div>
                  </td>
                  <td className="orders-table__cell orders-table__cell--actions">
                    <div className="orders-table__actions-cell">
                      <button
                        className="orders-table__action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(order);
                        }}
                        title="Редактировать"
                      >
                        <FiEdit3 />
                      </button>
                      <button
                        className="orders-table__action-btn orders-table__action-btn--delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(order);
                        }}
                        title="Удалить"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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

export default OrdersTable;

