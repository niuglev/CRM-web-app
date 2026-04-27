import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { apiClient } from '../api/client';
import './ProfilePage.scss';

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Загружаем текущий аватар при монтировании
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await apiClient.get('/users/me/avatar', {
          responseType: 'blob', // чтобы получить изображение
        });
        const url = URL.createObjectURL(response.data);
        setAvatarUrl(url);
      } catch (err) {
        // Если 404 – аватара нет, ничего страшного
        console.log('No avatar');
      }
    };
    fetchAvatar();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.dispatchEvent(new Event('auth:unauthorized'));
    navigate('/');
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      await apiClient.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // После загрузки обновляем аватар
      const response = await apiClient.get('/users/me/avatar', { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      setAvatarUrl(url);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Ошибка загрузки аватара');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!avatarUrl) return;
    setLoading(true);
    try {
      await apiClient.delete('/users/me/avatar');
      setAvatarUrl(null);
    } catch (err) {
      console.error('Delete failed', err);
      alert('Ошибка удаления аватара');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        <button className="profile-page__back" onClick={() => navigate(-1)}>
          ← {t('common.back')}
        </button>
        <h1>{t('profile.title')}</h1>

        <div className="profile-page__avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="avatar-img" />
          ) : (
            <div className="avatar-placeholder">👤</div>
          )}
          <div className="avatar-actions">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarUpload}
            />
            <button onClick={() => fileInputRef.current?.click()} disabled={loading}>
              {loading ? 'Загрузка...' : 'Загрузить аватар'}
            </button>
            {avatarUrl && (
              <button onClick={handleAvatarDelete} disabled={loading}>
                Удалить
              </button>
            )}
          </div>
        </div>

        <p>{t('profile.name')}: Никита (заглушка)</p>
        <p>Email: test@example.com</p>

        <LanguageSwitcher />

        <div className="profile-page__actions">
          <button onClick={() => navigate('/change-password')} className="profile-page__button">
            {t('profile.changePassword')}
          </button>
          <button onClick={handleLogout} className="profile-page__button profile-page__button--danger">
            {t('profile.logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;