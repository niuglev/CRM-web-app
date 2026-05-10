import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { apiClient } from '../api/client';
import './ProfilePage.scss';

interface UserProfileResponse {
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
}

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resolveAvatarUrl = (rawUrl?: string | null): string | null => {
    if (!rawUrl) return null;
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
    const apiBase = apiClient.defaults.baseURL || '';
    const origin = apiBase.replace(/\/api\/v1\/?$/, '');
    return `${origin}${rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`}`;
  };

  // Загружаем текущий аватар при монтировании
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await apiClient.get<UserProfileResponse>('/users/me');
        setAvatarUrl(resolveAvatarUrl(response.data.avatar_url));
        setFullName(response.data.full_name ?? null);
        setEmail(response.data.email ?? null);
      } catch (err) {
        console.error('Failed to fetch profile', err);
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
      const response = await apiClient.post<UserProfileResponse>('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAvatarUrl(resolveAvatarUrl(response.data.avatar_url));
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
      const response = await apiClient.delete<UserProfileResponse>('/users/me/avatar');
      setAvatarUrl(resolveAvatarUrl(response.data.avatar_url));
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
            <img src={avatarUrl} alt="Avatar" className="avatar-img" onError={() => setAvatarUrl(null)} />
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
              {loading ? t('common.loading') : t('profile.uploadAvatar')}
            </button>
            {avatarUrl && (
              <button onClick={handleAvatarDelete} disabled={loading}>
                {t('common.delete')}
              </button>
            )}
          </div>
        </div>

        <div className="profile-page__meta">
          <p>{t('profile.name')}: {fullName || t('profile.notSpecified')}</p>
          <p>Email: {email || t('profile.notSpecified')}</p>
        </div>

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