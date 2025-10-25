import React from 'react';
import { FiEdit3, FiEye } from 'react-icons/fi';
import type { Executor } from '../types';
import './ExecutorsTable.scss';

interface ExecutorsTableProps {
  executors: Executor[];
  onEdit: (executor: Executor) => void;
  onView: (executor: Executor) => void;
}

const ExecutorsTable: React.FC<ExecutorsTableProps> = ({ executors, onEdit, onView }) => {
  return (
    <div className="executors-table">
      <div className="executors-table__header">
        <h2 className="executors-table__title">Исполнители</h2>
        <div className="executors-table__actions">
          <button className="executors-table__btn executors-table__btn--primary">
            <span className="executors-table__btn-icon">+</span>
            Заказ
          </button>
          <button className="executors-table__btn executors-table__btn--primary">
            <span className="executors-table__btn-icon">+</span>
            Клиент
          </button>
        </div>
      </div>

      <div className="executors-table__content">
        <table className="executors-table__table">
          <thead>
            <tr className="executors-table__header-row">
              <th className="executors-table__header-cell">ИМЯ</th>
              <th className="executors-table__header-cell">КОНТАКТЫ</th>
              <th className="executors-table__header-cell">КОММЕНТАРИИ</th>
              <th className="executors-table__header-cell">ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody>
            {executors.map((executor, index) => (
              <tr 
                key={executor.id} 
                className={`executors-table__row ${index === 0 ? 'executors-table__row--selected' : ''}`}
              >
                <td className="executors-table__cell">
                  <div className="executors-table__name">
                    <div className="executors-table__name-text">{executor.name}</div>
                    <div className="executors-table__name-id">id-{executor.id}</div>
                  </div>
                </td>
                <td className="executors-table__cell">
                  <div className="executors-table__contacts">{executor.contacts}</div>
                </td>
                <td className="executors-table__cell">
                  <div className="executors-table__comments">{executor.comments}</div>
                </td>
                <td className="executors-table__cell">
                  <div className="executors-table__actions-cell">
                    <button 
                      className="executors-table__action-btn"
                      onClick={() => onEdit(executor)}
                      title="Редактировать"
                    >
                      <FiEdit3 />
                    </button>
                    <button 
                      className="executors-table__action-btn"
                      onClick={() => onView(executor)}
                      title="Просмотр"
                    >
                      <FiEye />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="executors-table__filters">
        <button className="executors-table__filter executors-table__filter--active">
          КОРПОРАТИВНЫЙ
        </button>
        <button className="executors-table__filter">
          ЧАСТНЫЙ
        </button>
      </div>
    </div>
  );
};

export default ExecutorsTable;
