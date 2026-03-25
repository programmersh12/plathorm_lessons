import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    dateOfBirth: ''
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        dateOfBirth: user.dateOfBirth || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // In a real app, you would update the profile via API
    // await updateProfile(profileData);
    
    setTimeout(() => {
      setSaving(false);
      setEditing(false);
      alert(t('profileUpdated', 'Профиль успешно обновлен!'));
    }, 1000);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        {t('loadingProfile', 'Загрузка профиля...')}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '30px',
        color: 'white',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          margin: '0',
          background: 'linear-gradient(to right, #ffffff, #e0e0ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {t('profile')}
        </h1>
      </div>
      
      <div className="card" style={{ 
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        border: '1px solid #e9ecef',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          color: '#3c3c3c',
          marginBottom: '20px'
        }}>
          {t('personalInfo')}
        </h2>
        
        {editing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="firstName" className="form-label" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '14px'
              }}>
                {t('firstName')}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-input"
                value={profileData.firstName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#f8f9fa'
                }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="lastName" className="form-label" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '14px'
              }}>
                {t('lastName')}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-input"
                value={profileData.lastName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#f8f9fa'
                }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="email" className="form-label" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '14px'
              }}>
                {t('email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={profileData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#f8f9fa'
                }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="bio" className="form-label" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '14px'
              }}>
                {t('bio')}
              </label>
              <textarea
                id="bio"
                name="bio"
                className="form-input"
                rows="4"
                value={profileData.bio}
                onChange={handleChange}
                style={{ 
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#f8f9fa',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="dateOfBirth" className="form-label" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500', 
                color: '#495057',
                fontSize: '14px'
              }}>
                {t('dateOfBirth')}
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                className="form-input"
                value={profileData.dateOfBirth}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#f8f9fa'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                type="submit" 
                className="gradient-button"
                disabled={saving}
                style={{ 
                  padding: '12px 24px',
                  fontSize: '15px',
                  fontWeight: '600',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  flex: 1
                }}
              >
                {saving ? t('savingChanges', 'Сохранение...') : t('saveChanges', 'Сохранить изменения')}
              </button>
              <button 
                type="button" 
                className="form-button"
                style={{ 
                  padding: '12px 24px',
                  fontSize: '15px',
                  fontWeight: '600',
                  borderRadius: '10px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(108, 117, 125, 0.4)',
                  flex: 1
                }}
                onClick={() => setEditing(false)}
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ 
              marginBottom: '15px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px'
            }}>
              <strong style={{ color: '#495057' }}>{t('nameLabel', 'Имя:')}</strong> 
              <span style={{ marginLeft: '8px', color: '#3c3c3c' }}>
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            
            <div style={{ 
              marginBottom: '15px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px'
            }}>
              <strong style={{ color: '#495057' }}>{t('emailLabel', 'Электронная почта:')}</strong> 
              <span style={{ marginLeft: '8px', color: '#3c3c3c' }}>
                {user?.email}
              </span>
            </div>
            
            <div style={{ 
              marginBottom: '15px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px'
            }}>
              <strong style={{ color: '#495057' }}>{t('roleLabel', 'Роль:')}</strong> 
              <span style={{ marginLeft: '8px', color: '#3c3c3c' }}>
                {user?.role}
              </span>
            </div>
            
            <div style={{ 
              marginBottom: '15px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px'
            }}>
              <strong style={{ color: '#495057' }}>{t('bioLabel', 'О себе:')}</strong> 
              <span style={{ marginLeft: '8px', color: '#3c3c3c' }}>
                {user?.bio || t('notProvided', 'Не указано')}
              </span>
            </div>
            
            <div style={{ 
              marginBottom: '15px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px'
            }}>
              <strong style={{ color: '#495057' }}>{t('dateOfBirthLabel', 'Дата рождения:')}</strong> 
              <span style={{ marginLeft: '8px', color: '#3c3c3c' }}>
                {user?.dateOfBirth || t('notProvided', 'Не указано')}
              </span>
            </div>
            
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px'
            }}>
              <strong style={{ color: '#495057' }}>{t('memberSinceLabel', 'Участник с:')}</strong> 
              <span style={{ marginLeft: '8px', color: '#3c3c3c' }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('notAvailable', 'Н/Д')}
              </span>
            </div>
            
            <button 
              className="gradient-button"
              onClick={() => setEditing(true)}
              style={{ 
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: '600',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                width: '100%'
              }}
            >
              {t('editProfile', 'Редактировать профиль')}
            </button>
          </div>
        )}
      </div>
      
      <div className="card" style={{ 
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        border: '1px solid #e9ecef',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        marginTop: '20px'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          color: '#3c3c3c',
          marginBottom: '20px'
        }}>
          {t('security')}
        </h2>
        <button 
          className="gradient-button"
          style={{ 
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: '600',
            borderRadius: '10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(220, 53, 69, 0.4)',
            width: '100%'
          }}
          onClick={() => alert(t('changePasswordAlert', 'Функционал изменения пароля будет здесь'))}
        >
          {t('changePassword')}
        </button>
      </div>
    </div>
  );
};

export default Profile;
