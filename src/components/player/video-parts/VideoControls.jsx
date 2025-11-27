// src/components/player/video-parts/VideoControls.jsx
import React, { useState } from 'react';
import { Gauge, Maximize2, Minimize2, Settings2, Captions } from 'lucide-react';
import SubtitleSettings from './SubtitleSettings';

const VideoControls = ({ 
  playbackSpeed, onSpeedChange, isSidebarCollapsed, toggleSidebar, 
  subSettings, setSubSettings, subtitleTracks, selectedTrackIndex, onTrackChange 
}) => {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSubSettings, setShowSubSettings] = useState(false);
  const [showSubTracks, setShowSubTracks] = useState(false);

  return (
    <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-2 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm relative">
      <div className="flex items-center gap-2">
         <button onClick={toggleSidebar} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
           {isSidebarCollapsed ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
           <span className="hidden sm:inline">{isSidebarCollapsed ? "Default View" : "Theater Mode"}</span>
         </button>

         <div className="relative">
            <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
              <Gauge size={16} /> <span>{playbackSpeed}x</span>
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden flex flex-col min-w-[80px] z-50">
                {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
                    <button key={rate} onClick={() => { onSpeedChange(rate); setShowSpeedMenu(false); }} className={`px-4 py-2 text-xs text-left hover:bg-slate-100 dark:hover:bg-white/5 ${playbackSpeed === rate ? 'text-orange-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                      {rate}x
                    </button>
                ))}
              </div>
            )}
         </div>
      </div>

      <div className="flex items-center gap-2 relative">
         <div className="relative">
           <button onClick={() => setShowSubTracks(!showSubTracks)} className={`p-2 rounded-lg transition-colors ${selectedTrackIndex !== -1 ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
             <Captions size={18} />
           </button>
           {showSubTracks && (
              <div className="absolute bottom-full right-0 mb-3 w-56 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1 max-h-64 overflow-y-auto custom-scrollbar">
                 <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-white/5">Available Subtitles</div>
                 <button onClick={() => { onTrackChange(-1); setShowSubTracks(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 ${selectedTrackIndex === -1 ? 'text-orange-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                   <span className={`w-1.5 h-1.5 rounded-full ${selectedTrackIndex === -1 ? 'bg-orange-500' : 'bg-transparent'}`}></span> Off
                 </button>
                 {subtitleTracks.map((track) => (
                   <button key={track.index} onClick={() => { onTrackChange(track.index); setShowSubTracks(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 ${selectedTrackIndex === track.index ? 'text-orange-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                     <span className={`w-1.5 h-1.5 shrink-0 rounded-full ${selectedTrackIndex === track.index ? 'bg-orange-500' : 'bg-transparent'}`}></span>
                     <span className="truncate">{track.title}</span>
                     <span className="opacity-50 ml-auto uppercase text-[9px] border border-slate-300 dark:border-zinc-700 px-1 rounded shrink-0">{track.language}</span>
                   </button>
                 ))}
              </div>
           )}
         </div>

         <button onClick={() => setShowSubSettings(!showSubSettings)} className={`p-2 rounded-lg transition-colors ${showSubSettings ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
           <Settings2 size={18} />
         </button>

         {showSubSettings && (
           <SubtitleSettings settings={subSettings} onChange={setSubSettings} onClose={() => setShowSubSettings(false)} />
         )}
      </div>
    </div>
  );
};

export default VideoControls;