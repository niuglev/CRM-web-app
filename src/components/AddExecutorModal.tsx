import React, { useState } from 'react';
import { FiUser, FiPhone, FiMessageSquare } from 'react-icons/fi';
import Modal from './Modal';
import type { Executor } from '../types';
import './AddExecutorModal.scss';

interface AddExecutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (executor: Omit<Executor, 'id'>) => void;
}

const AddExecutorModal: React.FC<AddExecutorModalProps> = ({ isOpen, onClose, onSubmit }) => {
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Добавить исполнителя">
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
            className="add-executor-modal__input"
            placeholder="Телефон, email, мессенджер и т.д."
            value={formData.contacts}
            onChange={(e) => setFormData({ ...formData, contacts: e.target.value })}
            required
          />
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
          <button
            type="button"
            className="add-executor-modal__btn add-executor-modal__btn--secondary"
            onClick={handleClose}
          >
            Отмена
          </button>
          <button type="submit" className="add-executor-modal__btn add-executor-modal__btn--primary">
            Добавить исполнителя
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExecutorModal;

