import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Modal from './Modal';
import type { Order } from '../types';
import './AddOrderModal.scss';
import { useTranslation } from 'react-i18next';

interface AddOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (order: Omit<Order, 'id'> & { customerContacts?: string; executorContacts?: string }) => void;
    clients?: Array<{ id: string; name: string }>;
    executors?: Array<{ id: string; name: string }>;
    initialData?: Order | null;
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    clients = [],
    executors = [],
    initialData,
}) => {
    const { t } = useTranslation();

    const [clientType, setClientType] = useState<'new' | 'existing'>('existing');
    const [executorType, setExecutorType] = useState<'new' | 'existing'>('existing');
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        customerId: '',
        customerName: '',
        customerContacts: '',
        description: '',
        address: '',
        executorId: '',
        executorName: '',
        executorContacts: '',
    });
    const [errors, setErrors] = useState<{ customerContacts?: string; executorContacts?: string }>({});

    React.useEffect(() => {
        if (initialData) {
            // Parse date "DD/MM/YYYY" to "YYYY-MM-DD" for type="date"
            let parsedDate = '';
            if (initialData.date && initialData.date.includes('/')) {
                const [day, month, year] = initialData.date.split('/');
                if (day && month && year) {
                    parsedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                }
            }

            // Parse time if exists "HH/MM" to "HH:MM"
            let parsedTime = '';
            if (initialData.time) {
                parsedTime = initialData.time.replace('/', ':');
            }

            setClientType('existing');
            setExecutorType(initialData.executorId && initialData.executorId !== 'auto' ? 'existing' : 'new');
            setFormData({
                date: parsedDate,
                time: parsedTime,
                customerId: initialData.customerId,
                customerName: initialData.customerName,
                customerContacts: '', // We don't have contacts in Order interface currently
                description: initialData.description,
                address: initialData.address,
                executorId: initialData.executorId || '',
                executorName: initialData.executorName || '',
                executorContacts: '',
            });
        } else {
            setClientType('existing');
            setExecutorType('existing');
            setFormData({
                date: '',
                time: '',
                customerId: '',
                customerName: '',
                customerContacts: '',
                description: '',
                address: '',
                executorId: '',
                executorName: '',
                executorContacts: '',
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${day}/${month}/${year}`;
    };

    const formatTime = (timeString: string): string => {
        if (!timeString) return '';
        return timeString.slice(0, 5).replace(':', '/');
    };

    const validateContacts = (contacts: string): string | undefined => {
        if (!contacts || contacts.trim().length === 0) {
            return t('contactsRequired');
        }

        const trimmedContacts = contacts.trim();

        if (trimmedContacts.length < 3) {
            return t('contactsTooShort');
        }

        const phoneRegex = /^[+]?\(?[0-9]{1,4}\)?[-\s.]?\(?[0-9]{1,4}\)?[-\s.]?[0-9]{1,9}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const messengerRegex = /^(tg\.|@|wa\(|wa\.|viber\.|telegram\.)/i;

        const isPhone = phoneRegex.test(trimmedContacts);
        const isEmail = emailRegex.test(trimmedContacts);
        const isMessenger = messengerRegex.test(trimmedContacts);
        const hasAtSymbol = trimmedContacts.includes('@');
        const hasDigits = /\d/.test(trimmedContacts);

        if (!isPhone && !isEmail && !isMessenger && !hasAtSymbol && !hasDigits) {
            return t('invalidContact');
        }

        return undefined;
    };

    const handleCustomerContactsChange = (value: string) => {
        setFormData({ ...formData, customerContacts: value });
        if (errors.customerContacts) {
            setErrors({ ...errors, customerContacts: undefined });
        }
    };

    const handleCustomerContactsBlur = () => {
        const error = validateContacts(formData.customerContacts);
        if (error) {
            setErrors({ ...errors, customerContacts: error });
        }
    };

    const handleExecutorContactsChange = (value: string) => {
        setFormData({ ...formData, executorContacts: value });
        if (errors.executorContacts) {
            setErrors({ ...errors, executorContacts: undefined });
        }
    };

    const handleExecutorContactsBlur = () => {
        if (!formData.executorContacts) {
            if (errors.executorContacts) setErrors({ ...errors, executorContacts: undefined });
            return;
        }
        const error = validateContacts(formData.executorContacts);
        if (error) {
            setErrors({ ...errors, executorContacts: error });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let hasError = false;
        const newErrors: { customerContacts?: string; executorContacts?: string } = {};

        if (clientType === 'new') {
            const cError = validateContacts(formData.customerContacts);
            if (cError) {
                newErrors.customerContacts = cError;
                hasError = true;
            }
        }

        if (executorType === 'new' && formData.executorContacts) {
            const eError = validateContacts(formData.executorContacts);
            if (eError) {
                newErrors.executorContacts = eError;
                hasError = true;
            }
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        if (
            formData.customerName &&
            formData.address &&
            formData.date &&
            formData.time &&
            formData.description
        ) {
            onSubmit({
                date: formatDate(formData.date),
                time: formatTime(formData.time),
                customerId: formData.customerId || 'auto',
                customerName: formData.customerName,
                description: formData.description,
                address: formData.address,
                executorId: formData.executorId || 'auto',
                executorName: formData.executorName || t('unassigned'),
                customerContacts: clientType === 'new' ? formData.customerContacts : undefined,
                executorContacts: executorType === 'new' ? formData.executorContacts : undefined,
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setClientType('existing');
        setExecutorType('existing');
        setFormData({
            date: '',
            time: '',
            customerId: '',
            customerName: '',
            customerContacts: '',
            description: '',
            address: '',
            executorId: '',
            executorName: '',
            executorContacts: '',
        });
        setErrors({});
        onClose();
    };

    const handleCustomerSelect = (customerId: string) => {
        const client = clients.find((c) => c.id === customerId);
        if (client) {
            setFormData({ ...formData, customerId: client.id, customerName: client.name });
        }
    };

    const handleExecutorSelect = (executorId: string) => {
        const executor = executors.find((e) => e.id === executorId);
        if (executor) {
            setFormData({ ...formData, executorId: executor.id, executorName: executor.name });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={initialData ? t('editOrderTitle') : t('newOrderTitle')}>
            <form className="add-order-modal" onSubmit={handleSubmit}>
                <div className="add-order-modal__client-type">
                    <label className="add-order-modal__radio">
                        <input
                            type="radio"
                            name="clientType"
                            value="new"
                            checked={clientType === 'new'}
                            onChange={(e) => setClientType(e.target.value as 'new' | 'existing')}
                        />
                        <span className="add-order-modal__radio-label">{t('newClient')}</span>
                    </label>
                    <label className="add-order-modal__radio">
                        <input
                            type="radio"
                            name="clientType"
                            value="existing"
                            checked={clientType === 'existing'}
                            onChange={(e) => setClientType(e.target.value as 'new' | 'existing')}
                        />
                        <span className="add-order-modal__radio-label">{t('existingClient')}</span>
                    </label>
                </div>

                {clientType === 'existing' && clients.length > 0 ? (
                    <div className="add-order-modal__field">
                        <label className="add-order-modal__label">{t('client')}</label>
                        <select
                            className="add-order-modal__input"
                            value={formData.customerId}
                            onChange={(e) => handleCustomerSelect(e.target.value)}
                            required
                        >
                            <option value="">{t('selectClient')}</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.name} (id-{client.id})
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="add-order-modal__row">
                        <div className="add-order-modal__field add-order-modal__field--half">
                            <label className="add-order-modal__label">{t('clientName')}</label>
                            <input
                                type="text"
                                className="add-order-modal__input"
                                placeholder={t('clientNamePlaceholder')}
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="add-order-modal__field add-order-modal__field--half">
                            <label className="add-order-modal__label">{t('clientContacts')}</label>
                            <input
                                type="text"
                                className={`add-order-modal__input ${errors.customerContacts ? 'add-order-modal__input--error' : ''}`}
                                placeholder={t('clientContactsPlaceholder')}
                                value={formData.customerContacts}
                                onChange={(e) => handleCustomerContactsChange(e.target.value)}
                                onBlur={handleCustomerContactsBlur}
                                required
                            />
                            {errors.customerContacts && (
                                <span className="add-order-modal__error">{errors.customerContacts}</span>
                            )}
                        </div>
                    </div>
                )}

                {/* --- EXECUTOR SECTION --- */}
                <div className="add-order-modal__client-type" style={{ marginTop: '16px' }}>
                    <label className="add-order-modal__radio">
                        <input
                            type="radio"
                            name="executorType"
                            value="new"
                            checked={executorType === 'new'}
                            onChange={(e) => setExecutorType(e.target.value as 'new' | 'existing')}
                        />
                        <span className="add-order-modal__radio-label">{t('newExecutor')}</span>
                    </label>
                    <label className="add-order-modal__radio">
                        <input
                            type="radio"
                            name="executorType"
                            value="existing"
                            checked={executorType === 'existing'}
                            onChange={(e) => setExecutorType(e.target.value as 'new' | 'existing')}
                        />
                        <span className="add-order-modal__radio-label">{t('existingExecutor')}</span>
                    </label>
                </div>

                {executorType === 'existing' && executors.length > 0 ? (
                    <div className="add-order-modal__field">
                        <label className="add-order-modal__label">{t('executor')}</label>
                        <select
                            className="add-order-modal__input"
                            value={formData.executorId}
                            onChange={(e) => handleExecutorSelect(e.target.value)}
                        >
                            <option value="">{t('selectExecutor')}</option>
                            {executors.map((exec) => (
                                <option key={exec.id} value={exec.id}>
                                    {exec.name} (id-{exec.id})
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="add-order-modal__row">
                        <div className="add-order-modal__field add-order-modal__field--half">
                            <label className="add-order-modal__label">{t('executorName')}</label>
                            <input
                                type="text"
                                className="add-order-modal__input"
                                placeholder={t('executorNamePlaceholderOptional')}
                                value={formData.executorName}
                                onChange={(e) => setFormData({ ...formData, executorName: e.target.value, executorId: '' })}
                            />
                        </div>
                        <div className="add-order-modal__field add-order-modal__field--half">
                            <label className="add-order-modal__label">{t('executorContacts')}</label>
                            <input
                                type="text"
                                className={`add-order-modal__input ${errors.executorContacts ? 'add-order-modal__input--error' : ''}`}
                                placeholder={t('executorContactsPlaceholderOptional')}
                                value={formData.executorContacts}
                                onChange={(e) => handleExecutorContactsChange(e.target.value)}
                                onBlur={handleExecutorContactsBlur}
                            />
                            {errors.executorContacts && (
                                <span className="add-order-modal__error">{errors.executorContacts}</span>
                            )}
                        </div>
                    </div>
                )}
                {/* --- END EXECUTOR SECTION --- */}

                <div className="add-order-modal__field">
                    <label className="add-order-modal__label">{t('address')}</label>
                    <input
                        type="text"
                        className="add-order-modal__input"
                        placeholder={t('addressPlaceholder')}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                    />
                </div>

                <div className="add-order-modal__row">
                    <div className="add-order-modal__field add-order-modal__field--date">
                        <label className="add-order-modal__label">{t('date')}</label>
                        <input
                            type="date"
                            className="add-order-modal__input"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>
                    <div className="add-order-modal__field add-order-modal__field--time">
                        <label className="add-order-modal__label">{t('time')}</label>
                        <input
                            type="time"
                            className="add-order-modal__input"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            required
                        />
                    </div>
                    <div className="add-order-modal__field add-order-modal__field--description">
                        <label className="add-order-modal__label">{t('orderDescription')}</label>
                        <textarea
                            className="add-order-modal__input add-order-modal__input--textarea"
                            placeholder={t('orderDescriptionPlaceholder')}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={1}
                        />
                    </div>
                </div>

                <div className="add-order-modal__actions">
                    <button type="submit" className="add-order-modal__btn add-order-modal__btn--primary">
                        {!initialData && <FiPlus className="add-order-modal__btn-icon" />}
                        <span>{initialData ? t('saveOrderChanges') : t('addOrder')}</span>
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddOrderModal;