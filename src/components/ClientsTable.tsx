import React, { useState } from 'react';
import { FiEdit3, FiEye, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import type { Client } from '../types';
import AddClientModal from './AddClientModal';
import './ClientsTable.scss';

interface ClientsTableProps {
    clients: Client[];
    onEdit: (client: Client) => void;
    onView: (client: Client) => void;
    onDelete: (client: Client) => void;
    onAddClient?: (client: Omit<Client, 'id'>) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients, onEdit, onView, onDelete, onAddClient }) => {
    const { t } = useTranslation();
    const [selectedFilter, setSelectedFilter] = useState<'corporate' | 'private'>('corporate');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState<string | null>(clients[0]?.id || null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
                <h1 className="clients-table__title">{t('clients.title')}</h1>
                <div className="clients-table__header-actions">
                    <div className="clients-table__search">
                        <FiSearch className="clients-table__search-icon" />
                        <input
                            type="text"
                            placeholder={t('clients.searchPlaceholder')}
                            className="clients-table__search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        className="clients-table__btn clients-table__btn--primary"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <FiPlus className="clients-table__btn-icon" />
                        {t('clients.addButton')}
                    </button>
                </div>
            </div>

            <div className="clients-table__filters">
                <button
                    className={`clients-table__filter ${selectedFilter === 'corporate' ? 'clients-table__filter--active' : ''}`}
                    onClick={() => setSelectedFilter('corporate')}
                >
                    {t('clients.corporate')}
                </button>
                <button
                    className={`clients-table__filter ${selectedFilter === 'private' ? 'clients-table__filter--active' : ''}`}
                    onClick={() => setSelectedFilter('private')}
                >
                    {t('clients.private')}
                </button>
            </div>

            <div className="clients-table__content">
                <table className="clients-table__table">
                    <thead>
                        <tr className="clients-table__header-row">
                            <th className="clients-table__header-cell">{t('clients.table.nameId')}</th>
                            <th className="clients-table__header-cell">{t('clients.table.contacts')}</th>
                            <th className="clients-table__header-cell">{t('clients.table.comments')}</th>
                            <th className="clients-table__header-cell clients-table__header-cell--actions">{t('clients.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="clients-table__empty">
                                    <div className="clients-table__empty-message">
                                        {t('clients.noClients')}
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
                                                title={t('common.edit')}
                                            >
                                                <FiEdit3 />
                                            </button>
                                            <button
                                                className="clients-table__action-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onView(client);
                                                }}
                                                title={t('common.view')}
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                className="clients-table__action-btn clients-table__action-btn--delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(client);
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
            <AddClientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={(clientData) => {
                    if (onAddClient) {
                        onAddClient(clientData);
                    }
                }}
            />
        </div>
    );
};

export default ClientsTable;







