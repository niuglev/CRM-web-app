import React, { useState } from 'react';
import { FiUser, FiPhone, FiMessageSquare } from 'react-icons/fi';
import Modal from './Modal';
import type { Executor } from '../types';
import './AddExecutorModal.scss';
import { useTranslation } from 'react-i18next';

interface AddExecutorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (executor: Omit<Executor, 'id'>) => void;
    initialData?: Executor | null;
}

const AddExecutorModal: React.FC<AddExecutorModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
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
            return t('executorContactsRequired');
        }

        const trimmedContacts = contacts.trim();

        if (trimmedContacts.length < 3) {
            return t('contactsTooShort'); // можно использовать тот же ключ, что и для клиента
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
            title={initialData ? t('editExecutorTitle') : t('addExecutorTitle')}
        >
            <form className="add-executor-modal" onSubmit={handleSubmit}>
                <div className="add-executor-modal__field">
                    <label className="add-executor-modal__label">
                        <FiUser className="add-executor-modal__label-icon" />
                        {t('executorNameLabel')}
                    </label>
                    <input
                        type="text"
                        className="add-executor-modal__input"
                        placeholder={t('executorNamePlaceholder')}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="add-executor-modal__field">
                    <label className="add-executor-modal__label">
                        <FiPhone className="add-executor-modal__label-icon" />
                        {t('executorContactsLabel')}
                    </label>
                    <input
                        type="text"
                        className={`add-executor-modal__input ${errors.contacts ? 'add-executor-modal__input--error' : ''}`}
                        placeholder={t('executorContactsPlaceholder')}
                        value={formData.contacts}
                        onChange={(e) => handleContactsChange(e.target.value)}
                        onBlur={handleContactsBlur}
                        required
                    />
                    {errors.contacts && (
                        <span className="add-executor-modal__error">{errors.contacts}</span>
                    )}
                </div>

                <div className="add-executor-modal__field">
                    <label className="add-executor-modal__label">
                        <FiMessageSquare className="add-executor-modal__label-icon" />
                        {t('executorCommentsLabel')}
                    </label>
                    <textarea
                        className="add-executor-modal__input add-executor-modal__input--textarea"
                        placeholder={t('executorCommentsPlaceholder')}
                        value={formData.comments}
                        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                        rows={4}
                    />
                </div>

                <div className="add-executor-modal__actions">
                    <button type="submit" className="add-executor-modal__btn add-executor-modal__btn--primary">
                        {initialData ? t('saveExecutorChanges') : t('addExecutor')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddExecutorModal;
