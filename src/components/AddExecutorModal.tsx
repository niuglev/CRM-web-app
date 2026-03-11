import React, { useState } from 'react';
import { FiUser, FiPhone, FiMessageSquare } from 'react-icons/fi';
import Modal from './Modal';
import type { Executor } from '../types';
import './AddExecutorModal.scss';

interface AddExecutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (executor: Omit<Executor, 'id'>) => void;
  initialData?: Executor | null;
}

const AddExecutorModal: React.FC<AddExecutorModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
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
      return 'Поле контактов обязательно для заполнения';
    }

    const trimmedContacts = contacts.trim();

    // Проверка на минимальную длину
    if (trimmedContacts.length < 3) {
      return 'Контакт слишком короткий (минимум 3 символа)';
    }

    // Проверка на валидный формат (телефон, email, мессенджер и т.д.)
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const messengerRegex = /^(tg\.|@|wa\(|wa\.|viber\.|telegram\.)/i;

    const isPhone = phoneRegex.test(trimmedContacts);
    const isEmail = emailRegex.test(trimmedContacts);
    const isMessenger = messengerRegex.test(trimmedContacts);
    const hasAtSymbol = trimmedContacts.includes('@');
    const hasDigits = /\d/.test(trimmedContacts);

    // Принимаем если это телефон, email, мессенджер или содержит @ или цифры
    if (!isPhone && !isEmail && !isMessenger && !hasAtSymbol && !hasDigits) {
      return 'Введите корректный контакт (телефон, email, мессенджер и т.д.)';
    }

    return undefined;
  };

  const handleContactsChange = (value: string) => {
    setFormData({ ...formData, contacts: value });
    // Очищаем ошибку при вводе
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
    <Modal isOpen={isOpen} onClose={handleClose} title={initialData ? "Редактировать исполнителя" : "Добавить исполнителя"}>
      <form className="add-executor-modal" onSubmit={handleSubmit}>
        <div className="add-executor-modal__field">
          <label className="add-executor-modal__label">
            <FiUser className="add-executor-modal__label-icon" />
            Имя
          </label>
          <input
            type="text"
            className="add-executor-modal__input"
            placeholder="Введите имя исполнителя"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="add-executor-modal__field">
          <label className="add-executor-modal__label">
            <FiPhone className="add-executor-modal__label-icon" />
            Контакты
          </label>
          <input
            type="text"
            className={`add-executor-modal__input ${errors.contacts ? 'add-executor-modal__input--error' : ''}`}
            placeholder="Телефон, email, мессенджер и т.д."
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
            Комментарии
          </label>
          <textarea
            className="add-executor-modal__input add-executor-modal__input--textarea"
            placeholder="Дополнительная информация об исполнителе"
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            rows={4}
          />
        </div>

        <div className="add-executor-modal__actions">
          <button type="submit" className="add-executor-modal__btn add-executor-modal__btn--primary">
            {initialData ? "Сохранить изменения" : "Добавить исполнителя"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExecutorModal;

