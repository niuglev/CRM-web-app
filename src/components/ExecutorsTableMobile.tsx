import React, { useState } from 'react';
import { FiEdit3, FiEye, FiPlus, FiSearch, FiPhone } from 'react-icons/fi';
import type { Executor } from '../types';
import './ExecutorsTableMobile.scss';

interface ExecutorsTableMobileProps {
  executors: Executor[];
  onEdit: (executor: Executor) => void;
  onView: (executor: Executor) => void;
}

const ExecutorsTableMobile: React.FC<ExecutorsTableMobileProps> = ({ executors, onEdit, onView }) => {
  const [selectedFilter, setSelectedFilter] = useState<'corporate' | 'private'>('corporate');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExecutor, setSelectedExecutor] = useState<string | null>(null);

  const filteredExecutors = executors.filter(executor => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        executor.name.toLowerCase().includes(query) ||
        executor.contacts.toLowerCase().includes(query) ||
        executor.comments.toLowerCase().includes(query) ||
        executor.id.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="executors-table-mobile">
      <div className="executors-table-mobile__header">
        <h1 className="executors-table-mobile__title">Исполнители</h1>
        <div className="executors-table-mobile__header-actions">
          <div className="executors-table-mobile__search">
            <FiSearch className="executors-table-mobile__search-icon" />
            <input
              type="text"
              placeholder="Поиск..."
              className="executors-table-mobile__search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="executors-table-mobile__btn executors-table-mobile__btn--primary">
            <FiPlus className="executors-table-mobile__btn-icon" />
            Добавить исполнителя
          </button>
        </div>
      </div>

      <div className="executors-table-mobile__filters">
        <button
          className={`executors-table-mobile__filter ${selectedFilter === 'corporate' ? 'executors-table-mobile__filter--active' : ''}`}
          onClick={() => setSelectedFilter('corporate')}
        >
          КОРПОРАТИВНЫЙ
        </button>
        <button
          className={`executors-table-mobile__filter ${selectedFilter === 'private' ? 'executors-table-mobile__filter--active' : ''}`}
          onClick={() => setSelectedFilter('private')}
        >
          ЧАСТНЫЙ
        </button>
      </div>

      <div className="executors-table-mobile__content">
        {filteredExecutors.length === 0 ? (
          <div className="executors-table-mobile__empty">
            <div className="executors-table-mobile__empty-message">Исполнители не найдены</div>
          </div>
        ) : (
          <div className="executors-table-mobile__list">
            {filteredExecutors.map((executor) => (
              <div
                key={executor.id}
                className={`executors-table-mobile__card ${
                  selectedExecutor === executor.id ? 'executors-table-mobile__card--selected' : ''
                }`}
                onClick={() => setSelectedExecutor(selectedExecutor === executor.id ? null : executor.id)}
              >
                <div className="executors-table-mobile__card-header">
                  <div className="executors-table-mobile__name">
                    <div className="executors-table-mobile__name-text">{executor.name}</div>
                    <div className="executors-table-mobile__name-id">ID: {executor.id}</div>
                  </div>
                  <div className="executors-table-mobile__actions">
                    <button
                      className="executors-table-mobile__action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(executor);
                      }}
                      title="Редактировать"
                    >
                      <FiEdit3 />
                    </button>
                    <button
                      className="executors-table-mobile__action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(executor);
                      }}
                      title="Просмотр"
                    >
                      <FiEye />
                    </button>
                  </div>
                </div>

                <div className="executors-table-mobile__card-body">
                  <div className="executors-table-mobile__field">
                    <FiPhone className="executors-table-mobile__field-icon" />
                    <div className="executors-table-mobile__field-content">
                      <div className="executors-table-mobile__field-label">Контакты</div>
                      <div className="executors-table-mobile__field-value">{executor.contacts}</div>
                    </div>
                  </div>

                  <div className="executors-table-mobile__field">
                    <div className="executors-table-mobile__field-content">
                      <div className="executors-table-mobile__field-label">Комментарии</div>
                      <div className="executors-table-mobile__field-value">{executor.comments}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutorsTableMobile;

