// src/components/views/music-parts/MusicQueue.jsx
import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MusicQueue = ({ showQueue, setShowQueue, queue, actions }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {showQueue && (
        <motion.div 
           initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}
           className="absolute top-0 right-0 bottom-24 w-80 bg-zinc-900/95 backdrop-blur-xl border-l border-white/10 z-30 flex flex-col shadow-2xl"
        >
           <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h3 className="font-bold text-white">{t('music.queue')}</h3>
              <button onClick={() => setShowQueue(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {queue.length === 0 && <div className="text-center text-slate-500 mt-10 text-sm">Queue is empty</div>}
              {queue.length > 0 && <div className="text-xs font-bold text-orange-500 px-2 mb-2 uppercase mt-2">{t('music.nextUp')}</div>}
              {queue.map((song, i) => (
                 <div key={i} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg group border-b border-white/5 last:border-0">
                    <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-xs text-slate-500">{i+1}</div>
                    <div className="min-w-0 flex-1">
                       <div className="text-sm text-white truncate font-medium">{song.title}</div>
                       <div className="text-xs text-slate-400 truncate">{song.artist}</div>
                    </div>
                    <div className="text-xs text-slate-500 text-right">{t('music.fromQueue')}</div>
                 </div>
              ))}
              {queue.length > 0 && <button onClick={actions.clearQueue} className="w-full mt-4 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded border border-red-500/20">{t('music.clearQueue')}</button>}
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MusicQueue;