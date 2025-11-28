// src/components/views/music-parts/MusicMainContent.jsx
import React from 'react';
import { Heart, ListMusic, Music, Play, Search, SortAsc, ListPlus, Plus, Clock, LayoutGrid, Disc, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MusicMainContent = ({
  currentView,
  playlists,
  currentSongsList,
  filteredSongs,
  currentSong,
  isPlaying,
  likedSongs,
  searchQuery,
  sortBy,
  activeSongForPlaylist,
  actions,
  setSearchQuery,
  setShowSortMenu,
  showSortMenu,
  setContextMenu,
  setActiveSongForPlaylist,
  formatTime
}) => {
  const { t } = useTranslation();

  const renderHomeGrid = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
        <LayoutGrid size={24} className="text-orange-500" />
        {t('music.playlists')}
      </h2>
      
      {playlists.length === 0 ? (
        <div className="text-center py-20 bg-white/20 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
           <Disc size={48} className="mx-auto text-slate-400 mb-4 opacity-50" />
           <p className="text-slate-500">{t('music.noPlaylists')}</p>
           <button onClick={actions.importPlaylist} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold shadow-lg hover:scale-105 transition-transform">
             {t('music.importPlaylist')}
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playlists.map(pl => (
            <div 
              key={pl.id} 
              onClick={() => actions.setCurrentView(pl.id)}
              className="group relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/5 dark:to-white/10 rounded-2xl p-6 flex flex-col justify-end overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border border-white/10"
            >
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
               
               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">
                     <Play size={20} fill="currentColor" className="ml-1" />
                  </div>
               </div>

               <div className="relative z-10">
                 <Disc size={32} className="text-white/80 mb-3" />
                 <h3 className="font-bold text-white text-lg leading-tight line-clamp-2">{pl.name}</h3>
                 <p className="text-white/60 text-xs mt-1 font-medium">{pl.songs.length} {t('music.songs')}</p>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSongList = () => (
    <>
      <div className="px-8 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl bg-white/5 dark:bg-[#121212]/60 border-b border-white/5">
          <div className="flex items-center gap-4">
            {currentSongsList.length > 0 && (
              <button onClick={() => actions.playSong(currentSongsList[0])} className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/40 hover:scale-105 transition-transform">
                <Play size={24} fill="currentColor" className="ml-1"/>
              </button>
            )}
            <div className="relative group w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input 
                type="text" 
                placeholder={t('music.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-white/10 border border-transparent focus:border-orange-500 text-sm focus:outline-none transition-all placeholder:text-slate-500"
              />
            </div>
          </div>
          
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setShowSortMenu(!showSortMenu); }} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
              <span className="text-sm">{t('music.sortBy')}</span> <SortAsc size={18} />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-8 w-40 bg-zinc-800 border border-white/10 rounded-lg shadow-xl z-50 py-1">
                {['title', 'artist', 'duration'].map(crit => (
                  <button key={crit} onClick={() => { actions.handleSortChange(crit); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2 text-sm ${sortBy === crit ? 'text-orange-500 font-bold' : 'text-slate-300 hover:bg-white/10'}`}>
                    {t(`music.sort${crit.charAt(0).toUpperCase() + crit.slice(1)}`)}
                  </button>
                ))}
              </div>
            )}
          </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-32">
        <div className="grid grid-cols-[40px_4fr_3fr_2fr_100px] gap-4 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/10 mb-2 sticky top-0">
          <div className="text-center">#</div>
          <div>{t('music.colTitle')}</div>
          <div>{t('music.colArtist')}</div>
          <div>{t('music.colAlbum')}</div>
          <div className="text-right">{t('music.colTime')}</div>
        </div>

        <div className="space-y-1">
          {filteredSongs.length === 0 ? (
            <div className="text-center py-10 text-slate-400">{t('music.noSongs')}</div>
          ) : (
            filteredSongs.map((song, i) => {
              const isCurrent = currentSong?.id === song.id;
              const isLiked = likedSongs.some(s => s.id === song.id);

              return (
                <div 
                  key={song.id}
                  onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, song }); }}
                  onDoubleClick={() => actions.playSong(song)}
                  className={`grid grid-cols-[40px_4fr_3fr_2fr_100px] gap-4 px-4 py-2.5 rounded-md items-center cursor-default transition-colors group hover:bg-slate-200/50 dark:hover:bg-white/10 ${isCurrent ? 'bg-slate-200 dark:bg-white/10' : ''}`}
                >
                  <div className="flex justify-center items-center w-full">
                    {isCurrent && isPlaying ? (
                      <div className="flex gap-[2px] items-end h-3">
                          <span className="w-1 h-full bg-orange-500 animate-[bounce_1s_infinite]"></span>
                          <span className="w-1 h-2/3 bg-orange-500 animate-[bounce_1.2s_infinite]"></span>
                          <span className="w-1 h-full bg-orange-500 animate-[bounce_0.8s_infinite]"></span>
                      </div>
                    ) : (
                      <span className={`text-sm font-mono text-slate-400 group-hover:hidden ${isCurrent ? 'text-orange-500' : ''}`}>{i + 1}</span>
                    )}
                    <button onClick={() => actions.playSong(song)} className="hidden group-hover:block text-slate-600 dark:text-white hover:scale-110 transition-transform">
                        <Play size={16} fill="currentColor" />
                    </button>
                  </div>
                  
                  <div className="min-w-0 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded bg-gradient-to-br ${isCurrent ? 'from-orange-400 to-red-500' : 'from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800'} flex items-center justify-center text-white/50 shrink-0`}>
                        <Music size={16} />
                      </div>
                      <div className="truncate">
                        <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-orange-600 dark:text-orange-400' : 'text-slate-800 dark:text-white'}`}>{song.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate group-hover:text-slate-700 dark:group-hover:text-white transition-colors">{song.artist}</p>
                      </div>
                  </div>

                  <div className="truncate text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">{song.album}</div>

                  <div className="flex items-center justify-end gap-2">
                      <button onClick={(e) => { e.stopPropagation(); actions.toggleLike(song); }} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isLiked ? 'opacity-100 text-orange-500' : 'text-slate-400 hover:text-white'}`}>
                        <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                      </button>
                      <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); setActiveSongForPlaylist(activeSongForPlaylist === song.id ? null : song.id); }} className={`p-1 rounded hover:bg-white/10 transition-all ${activeSongForPlaylist === song.id ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`}>
                           <ListPlus size={16} />
                        </button>
                        
                        {activeSongForPlaylist === song.id && (
                          <div className="absolute right-0 top-8 w-56 bg-zinc-800 border border-white/10 rounded-lg shadow-2xl z-50 p-1 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                            <div className="px-3 py-2 text-xs font-bold text-slate-400 border-b border-white/10 mb-1">{t('music.selectPlaylists')}</div>
                            {playlists.length === 0 && <div className="px-3 py-2 text-xs text-slate-500 italic">{t('music.noPlaylists')}</div>}
                            <div className="max-h-48 overflow-y-auto custom-scrollbar">
                              {playlists.map(pl => {
                                const isInPlaylist = pl.songs.find(s => s.path === song.path);
                                return (
                                  <div 
                                    key={pl.id} 
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded cursor-pointer text-sm text-slate-200" 
                                    onClick={() => { if (isInPlaylist) { actions.removeFromPlaylist(pl.id, song.path); } else { actions.addToPlaylist(pl.id, song); } }}
                                  >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isInPlaylist ? 'bg-orange-500 border-orange-500' : 'border-slate-500 hover:border-slate-300'}`}>
                                        {isInPlaylist && <Check size={10} className="text-white" strokeWidth={4} />}
                                    </div>
                                    <span className="truncate">{pl.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-mono text-slate-500 dark:text-slate-400 w-10 text-right">{formatTime(song.duration)}</span>
                  </div>
                </div>
              );
            })
          )}
          
          {currentView === 'library' && (
             <button onClick={actions.loadMoreSongs} className="w-full py-4 text-sm text-slate-500 hover:text-orange-500 transition-colors">Load More Songs...</button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white/40 dark:bg-[#121212]/40 backdrop-blur-md relative">
      <div className="h-64 bg-gradient-to-b from-slate-200 to-transparent dark:from-white/5 dark:to-transparent p-8 flex items-end gap-6 shrink-0">
        <div className="w-40 h-40 shadow-2xl shadow-black/20 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white">
            {currentView === 'liked' ? <Heart size={64} fill="currentColor"/> : 
            currentView === 'home' ? <Music size={64} /> :
            <ListMusic size={64}/>}
        </div>
        <div className="mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
              {currentView === 'home' ? t('music.home') : currentView === 'liked' ? 'Playlist' : 'Collection'}
            </p>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              {currentView === 'library' ? t('music.library') : 
              currentView === 'home' ? t('music.home') :
              currentView === 'liked' ? t('music.liked') : 
              playlists.find(p => p.id === currentView)?.name}
            </h1>
            {currentView !== 'home' && (
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                {currentSongsList.length} {t('music.songs')} • {formatTime(currentSongsList.reduce((acc, s) => acc + s.duration, 0))} {t('music.duration')}
              </p>
            )}
        </div>
      </div>

      {currentView === 'home' ? renderHomeGrid() : renderSongList()}
    </div>
  );
};

export default MusicMainContent;