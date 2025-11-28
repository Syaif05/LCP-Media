// src/components/views/QuickPlayerView.jsx
import React, { useRef } from 'react';
import VideoPlayer from '../player/video-parts/VideoPlayer';
import { ArrowLeft } from 'lucide-react';

const QuickPlayerView = ({ filePath, onBack }) => {
  const playerRef = useRef(null);

  // Mock object video agar kompatibel dengan VideoPlayer component
  const currentVideo = {
    path: filePath,
    baseName: filePath.split('\\').pop().split('/').pop(), // Ambil nama file dari path
    id: 'quick-play',
  };

  const subSettings = { enabled: false, size: 'Medium', color: '#fff', bg: 'rgba(0,0,0,0.7)' };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <button onClick={onBack} className="p-2.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors text-slate-500 dark:text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <div>
           <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-bold uppercase">Quick Play</span>
           </div>
           <h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{currentVideo.baseName}</h2>
        </div>
      </div>

      <div className="flex-1 bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 relative">
         <VideoPlayer 
            ref={playerRef}
            currentVideo={currentVideo}
            subtitleUrl={null}
            subSettings={subSettings}
            playbackSpeed={1}
            onEnded={() => {}}
            isExtractingSub={false}
            startTime={0}
            onTimeUpdate={() => {}}
         />
      </div>
    </div>
  );
};

export default QuickPlayerView;