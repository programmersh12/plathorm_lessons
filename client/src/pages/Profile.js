import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X,
  Key,
  Check,
  Sparkles,
  UserCheck
} from 'lucide-react';

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

    setTimeout(() => {
      setSaving(false);
      setEditing(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="orb orb-violet" style={{ top: '30%', left: '20%' }} />
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative py-12 px-4">
      <div className="orb orb-violet" style={{ top: '5%', left: '-5%' }} />
      <div className="orb orb-cyan" style={{ bottom: '15%', right: '-10%' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 p-8 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="relative flex items-center gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/30"
            >
              <User className="w-12 h-12 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Мой профиль
              </h1>
              <p className="text-white/80">
                {user?.firstName} {user?.lastName}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="badge-premium text-xs bg-white/20 border-white/30">
                  <UserCheck className="w-3 h-3" />
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              Личная информация
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn-secondary-premium px-4 py-2 text-sm flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Редактировать
              </button>
            )}
          </div>
          
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="form-field">
                  <label htmlFor="firstName" className="form-field-label flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" />
                    Имя
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="input-premium"
                    value={profileData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label htmlFor="lastName" className="form-field-label flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" />
                    Фамилия
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="input-premium"
                    value={profileData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-field">
                <label htmlFor="email" className="form-field-label flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-premium"
                  value={profileData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="bio" className="form-field-label flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  О себе
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  className="input-premium min-h-[120px]"
                  value={profileData.bio}
                  onChange={handleChange}
                  placeholder="Расскажите о себе..."
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="dateOfBirth" className="form-field-label flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Дата рождения
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  className="input-premium"
                  value={profileData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <motion.button 
                  type="submit" 
                  className="btn-premium flex-1 flex items-center justify-center gap-2"
                  disabled={saving}
                  whileTap={{ scale: 0.98 }}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Сохранить изменения
                    </>
                  )}
                </motion.button>
                <button 
                  type="button" 
                  className="btn-secondary-premium flex items-center gap-2"
                  onClick={() => setEditing(false)}
                >
                  <X className="w-5 h-5" />
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Имя</div>
                  <div className="text-white font-medium">{user?.firstName} {user?.lastName}</div>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Email</div>
                  <div className="text-white font-medium">{user?.email}</div>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Роль</div>
                  <div className="text-white font-medium capitalize">{user?.role}</div>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-slate-400">О себе</div>
                  <div className="text-white font-medium">{user?.bio || 'Не указано'}</div>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Дата рождения</div>
                  <div className="text-white font-medium">{user?.dateOfBirth || 'Не указана'}</div>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Участник с</div>
                  <div className="text-white font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Н/Д'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card"
        >
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Безопасность
          </h2>
          
          <button 
            className="w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Key className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-medium">Изменить пароль</div>
              <div className="text-sm text-slate-400">Обновите ваш пароль для безопасности</div>
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;