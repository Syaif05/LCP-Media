import React from 'react';
import { ArrowLeft } from 'lucide-react';

const PlayerHeader = ({ course, onBack, watchedCount, totalVideos }) => {
  return (
    <div className="flex items-center gap-4 mb-6 shrink-0">
      <button onClick={onBack} className="p-2.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors text-slate-500 dark:text-slate-400">
        <ArrowLeft size={20} />
      </button>
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{course.title}</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-zinc-700">
             {watchedCount} / {totalVideos} Completed
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerHeader;