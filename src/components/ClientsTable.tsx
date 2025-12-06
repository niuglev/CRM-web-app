import React, { useState } from 'react';
import { FiEdit3, FiEye, FiPlus, FiSearch } from 'react-icons/fi';
import type { Client } from '../types';
import './ClientsTable.scss';

interface ClientsTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onView: (client: Client) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients, onEdit, onView }) => {
  const [selectedFilter, setSelectedFilter] = useState<'corporate' | 'private'>('corporate');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(clients[0]?.id || null);

  const handleRowClick = (clientId: string) => {
    setSelectedClient(clientId);
  };

  const filteredClients = clients.filter(client => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        client.name.toLowerCase().includes(query) ||
        client.contacts.toLowerCase().includes(query) ||
        client.comments.toLowerCase().includes(query) ||
        client.id.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="clients-table">
      <div className="clients-table__header">
        <h1 className="clients-table__title">Клиенты</h1>
        <div className="clients-table__header-actions">
          <div className="clients-table__search">
            <FiSearch className="clients-table__search-icon" />
            <input
              type="text"
              placeholder="Поиск клиентов..."
              className="clients-table__search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="clients-table__btn clients-table__btn--primary">
            <FiPlus className="clients-table__btn-icon" />
            Заказ
          </button>
          <button className="clients-table__btn clients-table__btn--primary">
            <FiPlus className="clients-table__btn-icon" />
            Клиент
          </button>
        </div>
      </div>

      <div className="clients-table__filters">
        <button
          className={`clients-table__filter ${selectedFilter === 'corporate' ? 'clients-table__filter--active' : ''}`}
          onClick={() => setSelectedFilter('corporate')}
        >
          КОРПОРАТИВНЫЙ
        </button>
        <button
          className={`clients-table__filter ${selectedFilter === 'private' ? 'clients-table__filter--active' : ''}`}
          onClick={() => setSelectedFilter('private')}
        >
          ЧАСТНЫЙ
        </button>
      </div>

      <div className="clients-table__content">
        <table className="clients-table__table">
          <thead>
            <tr className="clients-table__header-row">
              <th className="clients-table__header-cell">ИМЯ ID</th>
              <th className="clients-table__header-cell">КОНТАКТЫ</th>
              <th className="clients-table__header-cell">КОММЕНТАРИИ</th>
              <th className="clients-table__header-cell clients-table__header-cell--actions">ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={4} className="clients-table__empty">
                  <div className="clients-table__empty-message">
                    Клиенты не найдены
                  </div>
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className={`clients-table__row ${selectedClient === client.id ? 'clients-table__row--selected' : ''}`}
                  onClick={() => handleRowClick(client.id)}
                >
                  <td className="clients-table__cell">
                    <div className="clients-table__name">
                      <div className="clients-table__name-text">{client.name}</div>
                      <div className="clients-table__name-id">id-{client.id}</div>
                    </div>
                  </td>
                  <td className="clients-table__cell">
                    <div className="clients-table__contacts">{client.contacts}</div>
                  </td>
                  <td className="clients-table__cell">
                    <div className="clients-table__comments" title={client.comments}>
                      {client.comments}
                    </div>
                  </td>
                  <td className="clients-table__cell clients-table__cell--actions">
                    <div className="clients-table__actions-cell">
                      <button
                        className="clients-table__action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(client);
                        }}
                        title="Редактировать"
                      >
                        <FiEdit3 />
                      </button>
                      <button
                        className="clients-table__action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(client);
                        }}
                        title="Просмотр"
                      >
                        <FiEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsTable;






