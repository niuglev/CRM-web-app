import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Modal from './Modal';
import type { Order } from '../types';
import './AddOrderModal.scss';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Omit<Order, 'id'>) => void;
  clients?: Array<{ id: string; name: string }>;
  executors?: Array<{ id: string; name: string }>;
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  clients = [],
  executors = [],
}) => {
  const [clientType, setClientType] = useState<'new' | 'existing'>('new');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    customerId: '',
    customerName: '',
    contacts: '',
    description: '',
    address: '',
    executorId: '',
    executorName: '',
  });
  const [errors, setErrors] = useState<{ contacts?: string }>({});

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

    if (
      formData.customerName &&
      formData.address &&
      formData.contacts &&
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
        executorName: formData.executorName || 'Не назначен',
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setClientType('new');
    setFormData({
      date: '',
      time: '',
      customerId: '',
      customerName: '',
      contacts: '',
      description: '',
      address: '',
      executorId: '',
      executorName: '',
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Новый заказ">
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
            <span className="add-order-modal__radio-label">Новый клиент</span>
          </label>
          <label className="add-order-modal__radio">
            <input
              type="radio"
              name="clientType"
              value="existing"
              checked={clientType === 'existing'}
              onChange={(e) => setClientType(e.target.value as 'new' | 'existing')}
            />
            <span className="add-order-modal__radio-label">Существующий клиент</span>
          </label>
        </div>

        {clientType === 'existing' && clients.length > 0 ? (
          <div className="add-order-modal__field">
            <label className="add-order-modal__label">Клиент</label>
            <select
              className="add-order-modal__input"
              value={formData.customerId}
              onChange={(e) => handleCustomerSelect(e.target.value)}
              required
            >
              <option value="">Выберите клиента</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} (id-{client.id})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="add-order-modal__field">
            <label className="add-order-modal__label">Имя клиента</label>
            <input
              type="text"
              className="add-order-modal__input"
              placeholder="Введите имя здесь"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              required
            />
          </div>
        )}

        <div className="add-order-modal__row">
          <div className="add-order-modal__field add-order-modal__field--half">
            <label className="add-order-modal__label">Адрес</label>
            <input
              type="text"
              className="add-order-modal__input"
              placeholder="Адрес"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div className="add-order-modal__field add-order-modal__field--half">
            <label className="add-order-modal__label">Контакты</label>
            <input
              type="text"
              className={`add-order-modal__input ${errors.contacts ? 'add-order-modal__input--error' : ''}`}
              placeholder="Номер телефона"
              value={formData.contacts}
              onChange={(e) => handleContactsChange(e.target.value)}
              onBlur={handleContactsBlur}
              required
            />
            {errors.contacts && (
              <span className="add-order-modal__error">{errors.contacts}</span>
            )}
          </div>
        </div>

        <div className="add-order-modal__row">
          <div className="add-order-modal__field add-order-modal__field--date">
            <label className="add-order-modal__label">Дата</label>
            <input
              type="date"
              className="add-order-modal__input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="add-order-modal__field add-order-modal__field--time">
            <label className="add-order-modal__label">Время</label>
            <input
              type="time"
              className="add-order-modal__input"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
          <div className="add-order-modal__field add-order-modal__field--description">
            <label className="add-order-modal__label">Описание заказа</label>
            <textarea
              className="add-order-modal__input add-order-modal__input--textarea"
              placeholder="Введите описание заказа"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={1}
            />
          </div>
        </div>

        <div className="add-order-modal__actions">
          <button type="submit" className="add-order-modal__btn add-order-modal__btn--primary">
            <FiPlus className="add-order-modal__btn-icon" />
            <span>Добавить заказ</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddOrderModal;
