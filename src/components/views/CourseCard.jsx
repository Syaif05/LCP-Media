// src/components/views/CourseCard.jsx
import React, { useState } from 'react';
import { BookOpen, Folder, MoreVertical, Trash2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CourseCard = ({ course, onClick, onRename, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  // Gunakan displayName jika ada, jika tidak gunakan title asli
  const displayName = course.displayName || course.title;
  // Nama folder asli
  const folderName = course.title !== displayName ? course.title : null; 

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(course);
    setShowMenu(false);
  };

  const handleRename = (e) => {
    e.stopPropagation();
    onRename(course);
    setShowMenu(false);
  };

  return (
    <motion.div 
      layout
      whileHover={{ y: -4 }}
      className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-500/30 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all cursor-pointer overflow-visible"
      onClick={() => onClick(course)}
    >
      {/* Menu Option (Absolute Position) */}
      <div className="absolute top-4 right-4 z-20">
          <button 
              onClick={handleMenuClick}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
          >
              <MoreVertical size={16} />
          </button>

          <AnimatePresence>
              {showMenu && (
                  <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden"
                      onClick={(e) => e.stopPropagation()} 
                  >
                      <button onClick={handleRename} className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2">
                          <Edit3 size={14} /> Rename
                      </button>
                      <button onClick={handleDelete} className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-slate-100 dark:border-white/5">
                          <Trash2 size={14} /> Remove
                      </button>
                  </motion.div>
              )}
          </AnimatePresence>
      </div>

      <div className="p-5 flex flex-col h-full">
        {/* Icon & Meta */}
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl text-orange-600 dark:text-orange-400">
            <BookOpen size={20} />
          </div>
          <div className="text-[10px] font-bold font-mono py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-500 uppercase tracking-wider">
             {course.totalVideos} Vids
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-auto">
            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-1" title={displayName}>
                {displayName}
            </h4>
            
            {/* Folder Name (Jika sudah direname) */}
            {folderName && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-zinc-500 mb-2">
                    <Folder size={10} />
                    <span className="truncate max-w-[200px]">{folderName}</span>
                </div>
            )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
            <div className="flex justify-between text-[10px] font-medium text-slate-400 mb-1.5">
               <span>Progress</span>
               <span>{course.progress || 0}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${course.progress || 0}%` }}></div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;