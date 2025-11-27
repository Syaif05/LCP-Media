// src/components/player/PlaylistSidebar.jsx
import React from 'react';
import { Play, CheckCircle, Check } from 'lucide-react';

const PlaylistSidebar = ({ videos, currentVideo, watchedVideos, onVideoChange, onToggleWatched }) => {
  return (
    <div className="flex-1 bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col overflow-hidden shadow-sm h-full">
      <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-zinc-900/30 flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-widest">Course Content</h3>
        <span className="text-[10px] px-2 py-0.5 bg-slate-200 dark:bg-zinc-800 rounded-full text-slate-500 dark:text-zinc-400">{videos.length} items</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {videos.map((video) => {
          const isWatched = watchedVideos[video.id]?.watched;
          const isActive = currentVideo?.id === video.id;

          return (
            <div 
              key={video.id} 
              className={`group flex items-stretch gap-0 rounded-xl transition-all border overflow-hidden ${
                isActive 
                  ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30 shadow-sm' 
                  : 'border-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              {/* KOLOM 1: Checkbox (Terpisah) */}
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleWatched(video.id); }}
                className={`w-10 flex items-center justify-center shrink-0 border-r border-slate-100 dark:border-white/5 transition-colors ${
                  isWatched ? 'bg-green-50 dark:bg-green-900/10' : 'hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
                title={isWatched ? "Mark as unwatched" : "Mark as watched"}
              >
                {isWatched ? (
                  <CheckCircle size={18} className="text-green-500" fill="currentColor" fillOpacity={0.2} />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-zinc-600 group-hover:border-orange-400 transition-colors"></div>
                )}
              </button>

              {/* KOLOM 2: Info Video */}
              <button
                onClick={() => onVideoChange(video)}
                className="flex-1 flex flex-col justify-center py-3 px-3 text-left min-w-0"
              >
                <div className="flex items-center gap-2 mb-1">
                   <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300' : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-500'}`}>
                     #{video.order}
                   </span>
                   {video.subtitle && <span className="text-[9px] px-1.5 rounded bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500 font-bold">CC</span>}
                </div>

                <h4 className={`text-sm font-semibold leading-snug ${
                  isActive 
                    ? 'text-orange-900 dark:text-orange-100' 
                    : 'text-slate-700 dark:text-zinc-300 group-hover:text-slate-900 dark:group-hover:text-white'
                } ${isWatched ? 'opacity-60' : ''}`}>
                  {video.baseName}
                </h4>
              </button>

              {/* Indikator Playing */}
              {isActive && (
                 <div className="w-1 bg-orange-500"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlaylistSidebar;