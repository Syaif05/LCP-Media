// src/components/views/music-parts/MusicPlayerBar.jsx
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat, Mic2, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayerBar = ({
  currentSong,
  isPlaying,
  volume,
  progress,
  duration,
  isShuffle,
  repeatMode,
  likedSongs,
  showQueue,
  setShowQueue,
  actions,
  formatTime
}) => {
  return (
    <AnimatePresence>
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-white dark:bg-[#18181b] border-t border-slate-200 dark:border-white/10 px-4 flex items-center justify-between z-50 shadow-2xl">
        
        <div className="w-[30%] flex items-center gap-4">
           {currentSong ? (
              <>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg shadow-lg flex items-center justify-center text-white shrink-0"><MusicIcon /></div>
                <div className="min-w-0">
                   <div className="font-bold text-slate-900 dark:text-white truncate text-sm hover:underline cursor-pointer">{currentSong.title}</div>
                   <div className="text-xs text-slate-500 dark:text-slate-400 truncate hover:underline cursor-pointer">{currentSong.artist}</div>
                </div>
                <button onClick={() => actions.toggleLike(currentSong)} className={`ml-2 ${likedSongs.some(s => s.id === currentSong.id) ? 'text-orange-500' : 'text-slate-400 hover:text-white'}`}>
                   <Heart size={18} fill={likedSongs.some(s => s.id === currentSong.id) ? "currentColor" : "none"} />
                </button>
              </>
           ) : (
             <div className="text-xs text-slate-500 ml-4">No song playing</div>
           )}
        </div>

        <div className="w-[40%] flex flex-col items-center gap-2">
           <div className="flex items-center gap-6">
              <button onClick={actions.toggleShuffle} className={`transition-colors ${isShuffle ? 'text-orange-500' : 'text-slate-400 hover:text-white'}`} title="Shuffle"><Shuffle size={18} /></button>
              <button onClick={actions.playPrev} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"><SkipBack size={24} fill="currentColor"/></button>
              <button onClick={actions.togglePlay} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg">{isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" ml={1}/>}</button>
              <button onClick={actions.playNext} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"><SkipForward size={24} fill="currentColor"/></button>
              <button onClick={actions.toggleRepeat} className={`transition-colors ${repeatMode !== 'off' ? 'text-orange-500 relative' : 'text-slate-400 hover:text-white'}`} title="Repeat"><Repeat size={18} />{repeatMode === 'one' && <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-white text-orange-500 px-0.5 rounded">1</span>}</button>
           </div>
           <div className="w-full flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-10 text-right">{formatTime(progress)}</span>
              <div className="flex-1 h-1 bg-slate-200 dark:bg-zinc-700 rounded-full relative group">
                 <div className="absolute top-0 left-0 h-full bg-orange-500 rounded-full" style={{width: `${(progress / (duration || 1)) * 100}%`}}></div>
                 <input type="range" min="0" max={duration || 100} value={progress} onChange={(e) => actions.seek(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <span className="w-10">{formatTime(duration)}</span>
           </div>
        </div>

        <div className="w-[30%] flex justify-end items-center gap-4 pr-4">
           <button onClick={() => setShowQueue(!showQueue)} className={`text-slate-400 hover:text-white transition-colors ${showQueue ? 'text-orange-500' : ''}`} title="Queue"><List size={20}/></button>
           <button className="text-slate-400 hover:text-white"><Mic2 size={18} /></button>
           <div className="flex items-center gap-2 w-24 group">
              <Volume2 size={20} className="text-slate-400" />
              <div className="flex-1 h-1 bg-slate-200 dark:bg-zinc-700 rounded-full relative">
                 <div className="absolute top-0 left-0 h-full bg-slate-500 group-hover:bg-orange-500 rounded-full" style={{width: `${volume * 100}%`}}></div>
                 <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => actions.changeVolume(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
           </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

const MusicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
);

export default MusicPlayerBar;