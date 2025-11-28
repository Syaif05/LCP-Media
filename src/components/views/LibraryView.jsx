// src/components/views/LibraryView.jsx
import React from 'react';
import { Search, BookOpen, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import CourseCard from './CourseCard';

const LibraryView = ({ 
  courses, 
  searchQuery, 
  setSearchQuery, 
  onOpenCourse,
  onRenameCourse,
  onDeleteCourse 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6 fade-in min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-slate-200 dark:border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{t('library.title')}</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            {t('library.subtitle', { count: courses.length })}
          </p>
        </div>

        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="relative group w-full md:w-80">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"/>
             <input 
               type="text" 
               placeholder={t('library.search')}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
             />
          </div>
          <button className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors shadow-sm">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-zinc-600">
           <BookOpen size={48} className="mb-4 opacity-20" />
           <p>{t('library.empty')} "{searchQuery}"</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {courses.map((course) => (
            <CourseCard 
                key={course.id}
                course={course}
                onClick={onOpenCourse}
                onRename={onRenameCourse}
                onDelete={onDeleteCourse}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LibraryView;