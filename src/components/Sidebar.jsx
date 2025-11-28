// src/components/Sidebar.jsx
import React from 'react';
import {
  Library,
  Settings,
  Plus,
  Sun,
  Moon,
  LayoutGrid,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Music
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Sidebar = ({
  activeMenu = 'dashboard',
  onChangeMenu,
  recentCourses = [],
  onOpenCourse,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', icon: LayoutGrid, label: t('menu.dashboard') },
    { id: 'library', icon: Library, label: t('menu.library') },
    { id: 'music', icon: Music, label: 'Music Player' },
    { id: 'settings', icon: Settings, label: t('menu.settings') }
  ];

  const storeUrl = 'https://shopee.co.id/officialgame.id';

  const handleOpenStore = (e) => {
    e.preventDefault();
    if (window.electron && window.electron.openExternal) {
      window.electron.openExternal(storeUrl);
    } else {
      window.open(storeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative shrink-0 p-6 flex items-center justify-between">
        <div className={`flex items-center gap-4 transition-all duration-300 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gradient-to-tr from-day-accent to-purple-500 rounded-xl shadow-lg shadow-indigo-500/30 text-white font-bold text-xl overflow-hidden">
            <img src="logo.png" alt="LCP" className="w-full h-full object-cover opacity-90" onError={(e) => e.target.style.display='none'} />
            <span className="absolute">L</span>
          </div>
          
          {!isCollapsed && (
            <div className="min-w-0 overflow-hidden">
              <h1 className="text-lg font-bold tracking-tight leading-none bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                LCP Media
              </h1>
              <p className="text-[10px] font-medium text-day-accent dark:text-night-accent tracking-wide mt-0.5">
                v0.5.0 Alpha
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        <div className="space-y-1.5">
          {!isCollapsed && (
            <h3 className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 opacity-80">
              Menu
            </h3>
          )}
          {menuItems.map((item) => {
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeMenu && onChangeMenu(item.id)}
                className={`relative w-full flex items-center px-3 py-3 rounded-2xl text-sm font-medium transition-all duration-300 group overflow-hidden ${
                  isActive
                    ? 'text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5'
                } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-day-accent to-purple-600 rounded-2xl -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon
                  size={20}
                  className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">
                {t('menu.recent')}
              </h3>
            </div>
          )}
          
          {recentCourses.slice(0, 3).map((course) => (
            <button
              key={course.id}
              onClick={() => onOpenCourse && onOpenCourse(course)}
              className={`w-full p-2 rounded-2xl transition-all duration-200 group hover:bg-white/60 dark:hover:bg-white/5 ${
                isCollapsed ? 'flex justify-center' : 'flex items-center gap-3'
              }`}
              title={course.title}
            >
              <div className="w-8 h-8 rounded-xl bg-slate-200/50 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-day-accent group-hover:text-white transition-colors">
                <PlayCircle size={16} />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-300 group-hover:text-day-accent dark:group-hover:text-night-accent transition-colors">
                    {course.title}
                  </p>
                  <div className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-day-accent dark:bg-night-accent rounded-full" 
                      style={{ width: `${course.progress || 0}%` }} 
                    />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 mt-auto">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-3 p-3 rounded-2xl bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 group"
        >
          <div className="relative w-5 h-5">
             <Sun size={20} className={`absolute inset-0 transition-all duration-500 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100 text-amber-500'}`} />
             <Moon size={20} className={`absolute inset-0 transition-all duration-500 ${theme === 'light' ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100 text-indigo-400'}`} />
          </div>
          {!isCollapsed && (
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-day-accent dark:group-hover:text-night-accent">
              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        <button
          onClick={() => onToggleCollapse && onToggleCollapse()}
          className="w-full flex justify-center mt-3 text-slate-400 hover:text-day-accent transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;