import React, { useState } from 'react';
import { FiUser, FiPhone, FiMessageSquare } from 'react-icons/fi';
import Modal from './Modal';
import type { Client } from '../types';
import './AddClientModal.scss';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: Omit<Client, 'id'>) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    contacts: '',
    comments: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Добавить клиента">
      <form className="add-client-modal" onSubmit={handleSubmit}>
        <div className="add-client-modal__field">
          <label className="add-client-modal__label">
            <FiUser className="add-client-modal__label-icon" />
            Имя
          </label>
          <input
            type="text"
            className="add-client-modal__input"
            placeholder="Введите имя клиента"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="add-client-modal__field">
          <label className="add-client-modal__label">
            <FiPhone className="add-client-modal__label-icon" />
            Контакты
          </label>
          <input
            type="text"
            className="add-client-modal__input"
            placeholder="Телефон, email, мессенджер и т.д."
            value={formData.contacts}
            onChange={(e) => setFormData({ ...formData, contacts: e.target.value })}
            required
          />
        </div>

        <div className="add-client-modal__field">
          <label className="add-client-modal__label">
            <FiMessageSquare className="add-client-modal__label-icon" />
            Комментарии
          </label>
          <textarea
            className="add-client-modal__input add-client-modal__input--textarea"
            placeholder="Дополнительная информация о клиенте"
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            rows={4}
          />
        </div>

        <div className="add-client-modal__actions">
          <button
            type="button"
            className="add-client-modal__btn add-client-modal__btn--secondary"
            onClick={handleClose}
          >
            Отмена
          </button>
          <button type="submit" className="add-client-modal__btn add-client-modal__btn--primary">
            Добавить клиента
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddClientModal;

