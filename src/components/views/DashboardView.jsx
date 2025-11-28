// src/components/views/DashboardView.jsx
import React from 'react';
import { Play, FolderOpen, Clock, Layout, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import CourseCard from './CourseCard';

const DashboardView = ({ 
  courses, 
  lastPlayedCourse, 
  onOpenCourse, 
  onCreateCourse,
  onRenameCourse,
  onDeleteCourse,
  onSeeAll 
}) => {
  const { t } = useTranslation();
  const dashboardCourses = courses.slice(0, 5);

  return (
    <div className="space-y-8 fade-in pb-10">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t('dashboard.welcome')}</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">{t('dashboard.subtitle')}</p>
        </div>
      </div>

      {lastPlayedCourse && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative w-full overflow-hidden rounded-3xl bg-[#0f1014] text-white shadow-xl shadow-orange-900/10 group cursor-pointer border border-white/5" 
          onClick={() => onOpenCourse(lastPlayedCourse)}
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4"></div>
          <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                <Clock size={12} /> {t('dashboard.continue')}
              </div>
              <h2 className="text-3xl font-bold mb-3 leading-tight tracking-tight text-white">{lastPlayedCourse.title}</h2>
              <p className="text-zinc-400 text-sm mb-8 font-medium line-clamp-1 opacity-80">{lastPlayedCourse.path}</p>
              <button className="flex items-center gap-3 bg-white text-black px-6 py-3.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-glow">
                <Play size={18} fill="currentColor" /> {t('dashboard.resumeBtn')}
              </button>
            </div>
            <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="364" strokeDashoffset={364 - (364 * (lastPlayedCourse.progress || 0)) / 100} className="text-orange-500 transition-all duration-1000" strokeLinecap="round" />
               </svg>
               <div className="absolute text-2xl font-bold tracking-tighter">{lastPlayedCourse.progress || 0}%</div>
            </div>
          </div>
        </motion.div>
      )}

      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Layout size={20} className="text-orange-500"/>
            {t('menu.recent')}
          </h3>
          <button onClick={onSeeAll} className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            {t('dashboard.seeAll')} <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <button 
              onClick={onCreateCourse}
              className="h-full min-h-[200px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-orange-500 group"
            >
              <div className="p-4 bg-slate-100 dark:bg-zinc-800 rounded-full group-hover:scale-110 transition-transform shadow-sm">
                <FolderOpen size={24} />
              </div>
              <span className="font-semibold text-sm">{t('dashboard.import')}</span>
            </button>

            {dashboardCourses.map((course) => (
              <CourseCard 
                key={course.id}
                course={course}
                onClick={onOpenCourse}
                onRename={onRenameCourse}
                onDelete={onDeleteCourse}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;