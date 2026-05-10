import React, { useState } from 'react';
import { FiUser, FiPhone, FiMessageSquare } from 'react-icons/fi';
import Modal from './Modal';
import type { Client } from '../types';
import './AddClientModal.scss';
import { useTranslation } from 'react-i18next';

interface AddClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (client: Omit<Client, 'id'>) => void;
    initialData?: Client | null;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: '',
        contacts: '',
        comments: '',
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                contacts: initialData.contacts,
                comments: initialData.comments,
            });
        } else {
            setFormData({
                name: '',
                contacts: '',
                comments: '',
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    const [errors, setErrors] = useState<{ contacts?: string }>({});

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

        // Принимаем если это телефон, email, мессенджер или содержит @ или цифры
        if (!isPhone && !isEmail && !isMessenger && !hasAtSymbol && !hasDigits) {
            return t('invalidContact');
        }

        return undefined;
    };

    const handleContactsChange = (value: string) => {
        setFormData({ ...formData, contacts: value });
        if (errors.contacts) {
            setErrors({ ...errors, contacts: undefined });
        }
    };

    const handleContactsBlur = () => {
        const error = validateContacts(formData.contacts);
        if (error) {
            setErrors({ ...errors, contacts: error });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const contactsError = validateContacts(formData.contacts);

        if (contactsError) {
            setErrors({ contacts: contactsError });
            return;
        }

        if (formData.name && formData.contacts) {
            onSubmit(formData);
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            contacts: '',
            comments: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={initialData ? t('editClientTitle') : t('addClientTitle')}
        >
            <form className="add-client-modal" onSubmit={handleSubmit}>
                <div className="add-client-modal__field">
                    <label htmlFor="clientName" className="add-client-modal__label">
                        <FiUser className="add-client-modal__label-icon" />
                        {t('nameLabel')}
                    </label>
                    <input
                        id="clientName"
                        type="text"
                        className="add-client-modal__input"
                        placeholder={t('namePlaceholder')}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="add-client-modal__field">
                    <label htmlFor="clientContacts" className="add-client-modal__label">
                        <FiPhone className="add-client-modal__label-icon" />
                        {t('contactsLabel')}
                    </label>
                    <input
                        id="clientContacts"
                        type="text"
                        className={`add-client-modal__input ${errors.contacts ? 'add-client-modal__input--error' : ''}`}
                        placeholder={t('contactsPlaceholder')}
                        value={formData.contacts}
                        onChange={(e) => handleContactsChange(e.target.value)}
                        onBlur={handleContactsBlur}
                        required
                    />
                    {errors.contacts && (
                        <span className="add-client-modal__error">{errors.contacts}</span>
                    )}
                </div>

                <div className="add-client-modal__field">
                    <label htmlFor="clientComments" className="add-client-modal__label">
                        <FiMessageSquare className="add-client-modal__label-icon" />
                        {t('commentsLabel')}
                    </label>
                    <textarea
                        id="clientComments"
                        className="add-client-modal__input add-client-modal__input--textarea"
                        placeholder={t('commentsPlaceholder')}
                        value={formData.comments}
                        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                        rows={4}
                    />
                </div>

                <div className="add-client-modal__actions">
                    <button type="submit" className="add-client-modal__btn add-client-modal__btn--primary">
                        {initialData ? t('saveChanges') : t('addClient')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddClientModal;
