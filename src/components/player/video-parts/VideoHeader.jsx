// src/components/player/video-parts/VideoHeader.jsx
import React from 'react';
import { Cloud, CheckCircle, Download, HardDrive } from 'lucide-react';

const VideoHeader = ({ currentVideo, onDownloadLocal }) => {
  if (!currentVideo) return null;

  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-3 overflow-hidden">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-1 leading-tight">
          {currentVideo.baseName}
        </h2>
        
        {currentVideo.isDownloaded ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase shrink-0 border border-green-200 dark:border-green-500/20">
            <HardDrive size={12} />
            <span>Local</span>
          </div>
        ) : currentVideo.isCloud ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase shrink-0 border border-blue-200 dark:border-blue-500/20">
            <Cloud size={12} />
            <span>Cloud</span>
          </div>
        ) : null}
      </div>
      
      {currentVideo.isCloud && !currentVideo.isDownloaded && (
        <button onClick={onDownloadLocal} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-orange-100 dark:hover:bg-orange-900/20 text-xs font-medium text-slate-600 dark:text-zinc-300 transition-colors group">
          <Download size={14} className="group-hover:text-orange-500" />
          <span>Save Offline</span>
        </button>
      )}

      {currentVideo.isDownloaded && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 text-xs font-medium text-slate-400 dark:text-zinc-500 cursor-default">
          <CheckCircle size={14} />
          <span>Available Offline</span>
        </div>
      )}
    </div>
  );
};

export default VideoHeader;