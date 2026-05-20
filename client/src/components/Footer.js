import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    courses: [
      { label: 'Веб-разработка', href: '/courses?category=Веб-разработка' },
      { label: 'Мобильная разработка', href: '/courses?category=Мобильная разработка' },
      { label: 'Data Science', href: '/courses?category=Data Science' },
      { label: 'Машинное обучение', href: '/courses?category=Машинное обучение' },
      { label: 'Кибербезопасность', href: '/courses?category=Кибербезопасность' },
    ],
    company: [
      { label: 'О нас', href: '#about' },
      { label: 'Карьера', href: '#' },
      { label: 'Блог', href: '#' },
      { label: 'Пресса', href: '#' },
      { label: 'Контакты', href: '#' },
    ],
    support: [
      { label: 'Центр помощи', href: '#' },
      { label: 'Сообщество', href: '#' },
      { label: 'Ресурсы', href: '#' },
      { label: 'Партнёры', href: '#' },
      { label: 'Обновления', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@vykod.com', label: 'Email' },
  ];

  return (
    <footer className="relative bg-slate-900/80 backdrop-blur-xl border-t border-slate-800/50 pt-16 pb-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-600 flex items-center justify-center">
                <span className="text-white font-black text-xl">V</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  VYKOD
                </span>
                <p className="text-xs text-slate-500">Платформа обучения</p>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 mb-6 max-w-sm"
            >
              Помогаем разработчикам расти через интерактивное обучение. 
              Осваивайте новые технологии с практическими заданиями.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex space-x-4"
            >
              {socialLinks.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/30 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 hover:border-purple-500/30 transition-all group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </motion.div>
          </div>
          
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg font-semibold text-white mb-4"
            >
              Курсы
            </motion.h3>
            <ul className="space-y-3">
              {footerLinks.courses.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link 
                    to={link.href}
                    className="text-slate-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg font-semibold text-white mb-4"
            >
              Компания
            </motion.h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  <Link 
                    to={link.href}
                    className="text-slate-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg font-semibold text-white mb-4"
            >
              Поддержка
            </motion.h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Link 
                    to={link.href}
                    className="text-slate-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-slate-500 text-sm">
            © {currentYear} VYKOD. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-slate-500 hover:text-slate-400 text-sm transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="#" className="text-slate-500 hover:text-slate-400 text-sm transition-colors">
              Условия использования
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/20">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-400">Сделано с заботой о разработчиках</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;