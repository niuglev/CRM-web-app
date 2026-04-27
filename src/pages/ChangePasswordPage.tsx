import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ChangePasswordPage.scss';

const ChangePasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      alert(t('changePassword.passwordsDoNotMatch'));
      return;
    }
    // TODO: заменить на реальный API-вызов
    alert('TODO: отправить запрос на смену пароля');
    navigate('/profile');
  };

  return (
    <div className="change-password-page">
      <div className="change-password-page__container">
        <button className="change-password-page__back" onClick={() => navigate(-1)}>
          ← {t('common.back')}
        </button>
        <h2>{t('changePassword.title')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('changePassword.old')}</label>
            <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t('changePassword.new')}</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t('changePassword.confirm')}</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          <div className="actions">
            <button type="submit">{t('changePassword.submit')}</button>
            <button type="button" onClick={() => navigate('/profile')}>{t('changePassword.cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;