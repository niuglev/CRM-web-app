import React, { useState } from 'react';
import { FiEdit3, FiEye, FiPlus, FiSearch, FiPhone, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import type { Client } from '../types';
import AddClientModal from './AddClientModal';
import './ClientsTableMobile.scss';

interface ClientsTableMobileProps {
    clients: Client[];
    onEdit: (client: Client) => void;
    onView: (client: Client) => void;
    onDelete: (client: Client) => void;
    onAddClient?: (client: Omit<Client, 'id'>) => void;
}

const ClientsTableMobile: React.FC<ClientsTableMobileProps> = ({ clients, onEdit, onView, onDelete, onAddClient }) => {
    const { t } = useTranslation();
    const [selectedFilter, setSelectedFilter] = useState<'corporate' | 'private'>('corporate');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
        <div className="clients-table-mobile">
            <div className="clients-table-mobile__header">
                <h1 className="clients-table-mobile__title">{t('clients.title')}</h1>
                <div className="clients-table-mobile__header-actions">
                    <div className="clients-table-mobile__search">
                        <FiSearch className="clients-table-mobile__search-icon" />
                        <input
                            type="text"
                            placeholder={t('clients.mobileSearchPlaceholder')}
                            className="clients-table-mobile__search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="clients-table-mobile__buttons">
                        <button
                            className="clients-table-mobile__btn clients-table-mobile__btn--primary"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <FiPlus className="clients-table-mobile__btn-icon" />
                            {t('clients.addButton')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="clients-table-mobile__filters">
                <button
                    className={`clients-table-mobile__filter ${selectedFilter === 'corporate' ? 'clients-table-mobile__filter--active' : ''}`}
                    onClick={() => setSelectedFilter('corporate')}
                >
                    {t('clients.corporate')}
                </button>
                <button
                    className={`clients-table-mobile__filter ${selectedFilter === 'private' ? 'clients-table-mobile__filter--active' : ''}`}
                    onClick={() => setSelectedFilter('private')}
                >
                    {t('clients.private')}
                </button>
            </div>

            <div className="clients-table-mobile__content">
                {filteredClients.length === 0 ? (
                    <div className="clients-table-mobile__empty">
                        <div className="clients-table-mobile__empty-message">{t('clients.noClients')}</div>
                    </div>
                ) : (
                    <div className="clients-table-mobile__list">
                        {filteredClients.map((client) => (
                            <div
                                key={client.id}
                                className={`clients-table-mobile__card ${selectedClient === client.id ? 'clients-table-mobile__card--selected' : ''
                                    }`}
                                onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
                            >
                                <div className="clients-table-mobile__card-header">
                                    <div className="clients-table-mobile__name">
                                        <div className="clients-table-mobile__name-text">{client.name}</div>
                                        <div className="clients-table-mobile__name-id">id-{client.id}</div>
                                    </div>
                                    <div className="clients-table-mobile__actions">
                                        <button
                                            className="clients-table-mobile__action-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(client);
                                            }}
                                            title={t('common.edit')}
                                        >
                                            <FiEdit3 />
                                        </button>
                                        <button
                                            className="clients-table-mobile__action-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onView(client);
                                            }}
                                            title={t('common.view')}
                                        >
                                            <FiEye />
                                        </button>
                                        <button
                                            className="clients-table-mobile__action-btn clients-table-mobile__action-btn--delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(client);
                                            }}
                                            title={t('common.delete')}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>

                                <div className="clients-table-mobile__card-body">
                                    <div className="clients-table-mobile__field">
                                        <FiPhone className="clients-table-mobile__field-icon" />
                                        <div className="clients-table-mobile__field-content">
                                            <div className="clients-table-mobile__field-label">{t('clients.contactsLabel')}</div>
                                            <div className="clients-table-mobile__field-value">{client.contacts}</div>
                                        </div>
                                    </div>

                                    <div className="clients-table-mobile__field">
                                        <div className="clients-table-mobile__field-content">
                                            <div className="clients-table-mobile__field-label">{t('clients.commentsLabel')}</div>
                                            <div className="clients-table-mobile__field-value">{client.comments}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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

export default ClientsTableMobile;

