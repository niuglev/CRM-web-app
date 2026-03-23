import React, { useState } from 'react';
import { FiEdit3, FiEye, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import type { Executor } from '../types';
import AddExecutorModal from './AddExecutorModal';
import './ExecutorsTable.scss';

interface ExecutorsTableProps {
    executors: Executor[];
    onEdit: (executor: Executor) => void;
    onView: (executor: Executor) => void;
    onDelete: (executor: Executor) => void;
    onAddExecutor?: (executor: Omit<Executor, 'id'>) => void;
}

const ExecutorsTable: React.FC<ExecutorsTableProps> = ({ executors, onEdit, onView, onDelete, onAddExecutor }) => {
    const { t } = useTranslation();
    const [selectedFilter, setSelectedFilter] = useState<'corporate' | 'private'>('corporate');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExecutor, setSelectedExecutor] = useState<string | null>(executors[0]?.id || null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleRowClick = (executorId: string) => {
        setSelectedExecutor(executorId);
    };

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
        <div className="executors-table">
            <div className="executors-table__header">
                <h1 className="executors-table__title">{t('executors.title')}</h1>
                <div className="executors-table__header-actions">
                    <div className="executors-table__search">
                        <FiSearch className="executors-table__search-icon" />
                        <input
                            type="text"
                            placeholder={t('executors.searchPlaceholder')}
                            className="executors-table__search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        className="executors-table__btn executors-table__btn--primary"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <FiPlus className="executors-table__btn-icon" />
                        {t('executors.addButton')}
                    </button>
                </div>
            </div>

            <div className="executors-table__filters">
                <button
                    className={`executors-table__filter ${selectedFilter === 'corporate' ? 'executors-table__filter--active' : ''}`}
                    onClick={() => setSelectedFilter('corporate')}
                >
                    {t('executors.corporate')}
                </button>
                <button
                    className={`executors-table__filter ${selectedFilter === 'private' ? 'executors-table__filter--active' : ''}`}
                    onClick={() => setSelectedFilter('private')}
                >
                    {t('executors.private')}
                </button>
            </div>

            <div className="executors-table__content">
                <table className="executors-table__table">
                    <thead>
                        <tr className="executors-table__header-row">
                            <th className="executors-table__header-cell">{t('executors.table.name')}</th>
                            <th className="executors-table__header-cell">{t('executors.table.contacts')}</th>
                            <th className="executors-table__header-cell">{t('executors.table.comments')}</th>
                            <th className="executors-table__header-cell executors-table__header-cell--actions">{t('executors.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExecutors.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="executors-table__empty">
                                    <div className="executors-table__empty-message">
                                        {t('executors.noExecutors')}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredExecutors.map((executor) => (
                                <tr
                                    key={executor.id}
                                    className={`executors-table__row ${selectedExecutor === executor.id ? 'executors-table__row--selected' : ''}`}
                                    onClick={() => handleRowClick(executor.id)}
                                >
                                    <td className="executors-table__cell">
                                        <div className="executors-table__name">
                                            <div className="executors-table__name-text">{executor.name}</div>
                                            <div className="executors-table__name-id">ID: {executor.id}</div>
                                        </div>
                                    </td>
                                    <td className="executors-table__cell">
                                        <div className="executors-table__contacts">{executor.contacts}</div>
                                    </td>
                                    <td className="executors-table__cell">
                                        <div className="executors-table__comments" title={executor.comments}>
                                            {executor.comments}
                                        </div>
                                    </td>
                                    <td className="executors-table__cell executors-table__cell--actions">
                                        <div className="executors-table__actions-cell">
                                            <button
                                                className="executors-table__action-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(executor);
                                                }}
                                                title={t('common.edit')}
                                            >
                                                <FiEdit3 />
                                            </button>
                                            <button
                                                className="executors-table__action-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onView(executor);
                                                }}
                                                title={t('common.view')}
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                className="executors-table__action-btn executors-table__action-btn--delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(executor);
                                                }}
                                                title={t('common.delete')}
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
            <AddExecutorModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={(executorData) => {
                    if (onAddExecutor) {
                        onAddExecutor(executorData);
                    }
                }}
            />
        </div>
    );
};

export default ExecutorsTable;