// src/components/views/music-parts/MusicSidebar.jsx
import React from 'react';
import { Music, Disc, Heart, FolderDown, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MusicSidebar = ({ 
  currentView, 
  playlists, 
  isCreatingPl, 
  newPlName, 
  actions, 
  setNewPlName, 
  setIsCreatingPl, 
  handleCreatePlaylist 
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-64 flex-shrink-0 flex flex-col h-full bg-slate-50/50 dark:bg-black/20 border-r border-white/10 backdrop-blur-xl">
      <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
        
        <div className="space-y-1">
          <button 
             onClick={() => actions.setCurrentView('home')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'home' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Music size={18} /> {t('music.home')}
          </button>
          <button 
             onClick={() => actions.setCurrentView('library')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'library' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Disc size={18} /> {t('music.library')}
          </button>
          <button 
             onClick={() => actions.setCurrentView('liked')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'liked' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Heart size={18} fill={currentView === 'liked' ? 'currentColor' : 'none'} /> {t('music.liked')}
          </button>
        </div>

        <div className="h-px bg-slate-200 dark:bg-white/10 mx-2"></div>

        <div>
          <div className="flex items-center justify-between px-2 mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('music.playlists')}</span>
            <div className="flex gap-1">
              <button onClick={actions.importPlaylist} className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors" title={t('music.importPlaylist')}><FolderDown size={16}/></button>
              <button onClick={() => setIsCreatingPl(true)} className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors" title={t('music.newPlaylist')}><Plus size={16}/></button>
            </div>
          </div>
          
          <div className="space-y-1">
            {isCreatingPl && (
              <form onSubmit={handleCreatePlaylist} className="px-2 mb-2">
                <input 
                  autoFocus 
                  className="w-full bg-white/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="Playlist name..."
                  value={newPlName}
                  onChange={e => setNewPlName(e.target.value)}
                  onBlur={() => setIsCreatingPl(false)}
                />
              </form>
            )}
            
            {playlists.length === 0 && !isCreatingPl && (
               <p className="text-xs text-slate-500 px-2 italic">{t('music.noPlaylists')}</p>
            )}

            {playlists.map(pl => (
              <div key={pl.id} className={`group flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentView === pl.id ? 'text-orange-500 bg-orange-500/10' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                  <span onClick={() => actions.setCurrentView(pl.id)} className="truncate flex-1">{pl.name}</span>
                  <button onClick={() => actions.deletePlaylist(pl.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicSidebar;