// src/components/views/MusicView.jsx
import React, { useState } from 'react';
import useMusicPlayer from '../../hooks/useMusicPlayer';
import MusicSetup from './music-parts/MusicSetup';
import MusicSidebar from './music-parts/MusicSidebar';
import MusicMainContent from './music-parts/MusicMainContent';
import MusicPlayerBar from './music-parts/MusicPlayerBar';
import MusicQueue from './music-parts/MusicQueue';
import MusicContextMenu from './music-parts/MusicContextMenu';

const MusicView = () => {
  const { 
    musicPath, playlists, likedSongs, recentlyPlayed, librarySongs,
    currentView, currentSongsList, currentSong, 
    isPlaying, volume, progress, duration, isShuffle, repeatMode, queue, sortBy,
    actions 
  } = useMusicPlayer();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingPl, setIsCreatingPl] = useState(false);
  const [newPlName, setNewPlName] = useState('');
  const [activeSongForPlaylist, setActiveSongForPlaylist] = useState(null); 
  const [contextMenu, setContextMenu] = useState(null);
  const [showQueue, setShowQueue] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filteredSongs = currentSongsList.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlName.trim()) {
      actions.createPlaylist(newPlName);
      setNewPlName('');
      setIsCreatingPl(false);
    }
  };

  if (!musicPath) {
    return <MusicSetup onSelectFolder={actions.selectFolder} />;
  }

  return (
    <div className="flex h-[calc(100vh-100px)] gap-0 -m-4 fade-in relative overflow-hidden" onClick={() => { setContextMenu(null); setActiveSongForPlaylist(null); setShowSortMenu(false); }}>
      
      <MusicSidebar 
        currentView={currentView}
        playlists={playlists}
        isCreatingPl={isCreatingPl}
        newPlName={newPlName}
        actions={actions}
        setNewPlName={setNewPlName}
        setIsCreatingPl={setIsCreatingPl}
        handleCreatePlaylist={handleCreatePlaylist}
      />

      <MusicMainContent 
        currentView={currentView}
        playlists={playlists}
        currentSongsList={currentSongsList}
        filteredSongs={filteredSongs}
        currentSong={currentSong}
        isPlaying={isPlaying}
        likedSongs={likedSongs}
        searchQuery={searchQuery}
        sortBy={sortBy}
        activeSongForPlaylist={activeSongForPlaylist}
        actions={actions}
        setSearchQuery={setSearchQuery}
        setShowSortMenu={setShowSortMenu}
        showSortMenu={showSortMenu}
        setContextMenu={setContextMenu}
        setActiveSongForPlaylist={setActiveSongForPlaylist}
        formatTime={formatTime}
      />

      <MusicQueue 
        showQueue={showQueue}
        setShowQueue={setShowQueue}
        queue={queue}
        actions={actions}
      />

      <MusicContextMenu 
        contextMenu={contextMenu}
        playlists={playlists}
        actions={actions}
        setIsCreatingPl={setIsCreatingPl}
        setContextMenu={setContextMenu}
      />

      <MusicPlayerBar 
        currentSong={currentSong}
        isPlaying={isPlaying}
        volume={volume}
        progress={progress}
        duration={duration}
        isShuffle={isShuffle}
        repeatMode={repeatMode}
        likedSongs={likedSongs}
        showQueue={showQueue}
        setShowQueue={setShowQueue}
        actions={actions}
        formatTime={formatTime}
      />

    </div>
  );
};

export default MusicView;