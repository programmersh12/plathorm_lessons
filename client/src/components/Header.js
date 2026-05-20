import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  LayoutDashboard, 
  User, 
  LogIn, 
  UserPlus, 
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Главная', href: '/', icon: Sparkles },
    { name: 'Курсы', href: '/courses', icon: BookOpen },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-slate-900/90 backdrop-blur-2xl border-b border-slate-700/30 shadow-2xl shadow-purple-500/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-black text-2xl">V</span>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-500 to-cyan-500 blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            </div>
            <div>
              <span className="text-3xl font-black bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                VYKOD
              </span>
              <p className="text-xs text-slate-400 font-medium -mt-0.5">Платформа обучения</p>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                    location.pathname === item.href
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {location.pathname === item.href && (
                    <motion.div
                      layoutId="navbar"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon size={16} className="relative z-10" />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              </motion.div>
            ))}
            
            <div className="w-px h-8 bg-slate-700/50 mx-4" />
            
            <DarkModeToggle />

            {user ? (
              <div className="flex items-center gap-3 ml-4">
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  Кабинет
                </Link>
                <Link
                  to="/profile"
                  className="p-2.5 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
                >
                  <User size={18} />
                </Link>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                  type="button"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300 flex items-center gap-2"
                >
                  <LogIn size={16} />
                  Войти
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  Регистрация
                </Link>
              </div>
            )}
          </nav>

          <div className="flex items-center space-x-3 md:hidden">
            <DarkModeToggle />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-11 h-11 rounded-xl bg-slate-800/50 backdrop-blur flex items-center justify-center border border-slate-700/30"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.svg
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden pb-4"
            >
              <div className="py-4 space-y-2 glass rounded-2xl p-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-cyan-500/20 font-medium transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon size={18} />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 border-t border-slate-700/50 space-y-2">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-center bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LayoutDashboard size={18} />
                        Кабинет: {user.firstName}
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={18} />
                        Профиль
                      </Link>
                      <button
                        type="button"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-400 hover:bg-red-500/10 transition-all duration-300"
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOut size={18} />
                        Выйти
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-center bg-slate-800/50 text-slate-300 hover:text-white transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LogIn size={18} />
                        Войти
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-center bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserPlus size={18} />
                        Регистрация
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {scrolled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
        />
      )}
    </motion.header>
  );
};

export default Header;