// src/components/Sidebar.jsx
import React from 'react';
import {
  Library,
  Settings,
  Plus,
  Sun,
  Moon,
  Disc,
  LayoutGrid,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Sidebar = ({
  activeMenu = 'dashboard',
  onChangeMenu,
  recentCourses = [],
  onOpenCourse,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'library', icon: Library, label: 'My Library' },
    { id: 'settings', icon: Settings, label: 'Settings' }
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

  const handleToggleCollapse = () => {
    if (onToggleCollapse) onToggleCollapse();
  };

  return (
    <div
      className={`h-full flex flex-col bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border transition-all duration-300 no-drag shadow-xl shadow-black/5 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="relative shrink-0">
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3'}`}>
          <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-700 overflow-hidden">
            <img src="logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 overflow-hidden whitespace-nowrap">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">LCP Media</h1>
              <p className="text-[10px] opacity-60 font-medium text-slate-500 dark:text-slate-400">v0.3.0 Pro</p>
            </div>
          )}
        </div>
        <button
          onClick={handleToggleCollapse}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-1 rounded-full shadow-sm text-slate-500 dark:text-slate-400 hover:text-orange-500 z-50 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <div className="flex-1 px-3 space-y-6 overflow-y-auto custom-scrollbar overflow-x-hidden">
        <div>
          {!isCollapsed && (
            <h3 className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Menu</h3>
          )}
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeMenu && onChangeMenu(item.id)}
                  className={`group relative w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer text-left ${
                    isActive
                      ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-white/5 hover:text-orange-600 dark:hover:text-gray-100'
                  } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
                  title={isCollapsed ? item.label : ''}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className={`bg-orange-500 ${
                        isCollapsed
                          ? 'absolute bottom-0 left-2 right-2 h-1 rounded-full'
                          : 'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full'
                      }`}
                    />
                  )}
                  <item.icon
                    size={20}
                    className={`shrink-0 ${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-orange-500'}`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {!isCollapsed ? (
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent</h3>
              <button className="p-1 rounded-lg hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                <Plus size={14} className="text-gray-400" />
              </button>
            </div>
          ) : (
            <div className="h-px bg-slate-200 dark:bg-white/10 my-4 mx-2" />
          )}
          
          <div className="space-y-2 px-1">
            {recentCourses.map((course) =>
              isCollapsed ? (
                <button
                  key={course.id}
                  onClick={() => onOpenCourse && onOpenCourse(course)}
                  className="w-full flex justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-orange-500 transition-colors"
                  title={course.title}
                >
                  <PlayCircle size={20} />
                </button>
              ) : (
                <button
                  key={course.id}
                  onClick={() => onOpenCourse && onOpenCourse(course)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 flex items-center gap-3 cursor-pointer hover:border-orange-300 dark:hover:border-orange-500/50 transition-all group text-left shadow-sm hover:shadow-md"
                >
                  <div className="flex-1 min-w-0 grid">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400">
                      {course.title}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5 font-medium">
                      {course.progress ?? 0}% Completed
                    </p>
                  </div>
                  <PlayCircle size={18} className="text-slate-300 group-hover:text-orange-500 shrink-0" />
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-light-border dark:border-dark-border shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 border border-slate-200 dark:border-white/5 mb-4">
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                theme === 'light' ? 'bg-white shadow-sm text-slate-900' : 'text-gray-400'
              }`}
            >
              <Sun size={14} />
              Light
            </button>
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={`flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                theme === 'dark' ? 'bg-zinc-700 shadow-sm text-white' : 'text-gray-500'
              }`}
            >
              <Moon size={14} />
              Dark
            </button>
          </div>
        ) : (
          <button
            onClick={toggleTheme}
            className="w-full flex justify-center p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 dark:text-gray-400 mb-4"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        )}

        {!isCollapsed && (
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50 dark:from-orange-500/10 dark:via-amber-500/10 dark:to-rose-500/10 rounded-xl p-3 border border-orange-100/70 dark:border-orange-500/25">
            <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-[0.18em] mb-2">
              Supported By
            </p>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  Officialgame.id
                </p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                  Dev: Syaifulloh
                </p>
              </div>
              <a
                href={storeUrl}
                onClick={handleOpenStore}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 text-[10px] font-semibold text-orange-600 dark:text-orange-300 border border-orange-200/80 dark:border-orange-500/40 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors whitespace-nowrap"
              >
                <span>Visit</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;