// src/components/views/music-parts/MusicContextMenu.jsx
import React from 'react';
import { ListMusic } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MusicContextMenu = ({ contextMenu, playlists, actions, setIsCreatingPl, setContextMenu }) => {
  const { t } = useTranslation();

  if (!contextMenu) return null;

  return (
    <div 
      className="fixed z-[100] bg-white dark:bg-[#282828] border border-slate-200 dark:border-zinc-700 rounded shadow-2xl py-1 w-56 text-sm"
      style={{ top: contextMenu.y, left: contextMenu.x }}
      onClick={(e) => e.stopPropagation()}
    >
       <div className="px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 border-b border-white/10 mb-1 pointer-events-none">{t('music.addToPlaylist')}</div>
       
       <button onClick={() => { actions.addToQueue(contextMenu.song); setContextMenu(null); }} className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2">
          <ListMusic size={14} /> {t('music.addToQueue')}
       </button>
       
       {playlists.map(pl => (
         <button 
           key={pl.id}
           onClick={() => { actions.addToPlaylist(pl.id, contextMenu.song); setContextMenu(null); }}
           className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-orange-500 hover:text-white transition-colors"
         >
           {pl.name}
         </button>
       ))}
       
       <button className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-orange-500 hover:text-white transition-colors border-t border-white/10" onClick={() => { setIsCreatingPl(true); setContextMenu(null); }}>
         + {t('music.newPlaylist')}
       </button>
    </div>
  );
};

export default MusicContextMenu;