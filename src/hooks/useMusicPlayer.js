// src/hooks/useMusicPlayer.js
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const globalAudio = new Audio();

const useMusicPlayer = () => {
  const { t } = useTranslation();
  const [musicPath, setMusicPath] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [librarySongs, setLibrarySongs] = useState([]); 
  
  const [currentView, setCurrentView] = useState('home'); 
  const [currentSongsList, setCurrentSongsList] = useState([]);
  
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); 
  const [queue, setQueue] = useState([]); 
  const [sortBy, setSortBy] = useState('title'); 

  const [page, setPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    const init = async () => {
      const path = await window.electron.getMusicPath();
      setMusicPath(path);
      const pl = await window.electron.getPlaylists();
      setPlaylists(pl);
      const likes = await window.electron.getLikedSongs();
      setLikedSongs(likes);
      const recent = await window.electron.getRecentlyPlayed();
      setRecentlyPlayed(recent);
    };
    init();
  }, []);

  useEffect(() => {
    const all = playlists.flatMap(pl => pl.songs);
    const uniqueMap = new Map();
    all.forEach(song => {
      if (!uniqueMap.has(song.path)) {
        uniqueMap.set(song.path, song);
      }
    });
    setLibrarySongs(Array.from(uniqueMap.values()));
  }, [playlists]);

  useEffect(() => {
    const audio = globalAudio;
    
    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => handleSongEnd();
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [isShuffle, repeatMode, currentSong, currentSongsList, queue]);

  const sortSongs = (songs, criteria) => {
    return [...songs].sort((a, b) => {
      if (criteria === 'title') return a.title.localeCompare(b.title);
      if (criteria === 'artist') return a.artist.localeCompare(b.artist);
      if (criteria === 'duration') return b.duration - a.duration;
      return 0;
    });
  };

  useEffect(() => {
    let baseList = [];
    if (currentView === 'home') {
      baseList = []; 
    } else if (currentView === 'library') {
      baseList = librarySongs;
    } else if (currentView === 'liked') {
      baseList = likedSongs;
    } else {
      const pl = playlists.find(p => p.id === currentView);
      baseList = pl ? pl.songs : [];
    }

    const sorted = sortSongs(baseList, sortBy);
    
    if (currentView === 'library') {
      setCurrentSongsList(sorted.slice(0, page * itemsPerPage));
    } else {
      setCurrentSongsList(sorted);
    }
  }, [currentView, playlists, likedSongs, librarySongs, sortBy, page]);

  const loadMoreSongs = () => {
    if (currentView === 'library' && currentSongsList.length < librarySongs.length) {
      setPage(prev => prev + 1);
    }
  };

  const selectFolder = async () => {
    const path = await window.electron.selectMusicFolder();
    if (path) {
      setMusicPath(path);
      importPlaylist(); 
    }
  };

  const importPlaylist = async () => {
    const pl = await window.electron.importPlaylistFromFolder();
    if (pl) {
      setPlaylists(pl);
      toast.success(t('music.importPlaylist') + ' success');
    }
  };

  const createPlaylist = async (name) => {
    const newPl = await window.electron.createPlaylist(name);
    setPlaylists(newPl);
    toast.success('Playlist created');
  };

  const deletePlaylist = async (id) => {
    const newPl = await window.electron.deletePlaylist(id);
    setPlaylists(newPl);
    if (currentView === id) setCurrentView('home');
    toast.success('Playlist deleted');
  };

  const addToPlaylist = async (playlistId, song) => {
    await window.electron.addSongToPlaylist({ playlistId, song });
    const pl = await window.electron.getPlaylists();
    setPlaylists(pl);
    toast.success('Added to playlist');
  };

  const removeFromPlaylist = async (playlistId, songPath) => {
    await window.electron.removeSongFromPlaylist({ playlistId, songPath });
    const pl = await window.electron.getPlaylists();
    setPlaylists(pl);
    toast.success('Removed from playlist');
  };

  const addToQueue = (song) => {
    setQueue(prev => [...prev, song]);
    toast.success(t('music.addedToQueue'));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const toggleLike = async (song) => {
    const newLikes = await window.electron.toggleLikeSong(song);
    setLikedSongs(newLikes);
  };

  const playSong = async (song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
      return;
    }
    
    const newRecent = await window.electron.addToRecentlyPlayed(song);
    setRecentlyPlayed(newRecent);

    const url = `lcp://${encodeURIComponent(song.path.replace(/\\/g, '/'))}`;
    globalAudio.src = url;
    globalAudio.play();
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (globalAudio.paused) {
      globalAudio.play();
    } else {
      globalAudio.pause();
    }
  };

  const handleSongEnd = () => {
    if (repeatMode === 'one') {
      globalAudio.currentTime = 0;
      globalAudio.play();
    } else {
      playNext();
    }
  };

  const playNext = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setQueue(prev => prev.slice(1));
      playSong(nextSong);
      return;
    }

    if (!currentSong || currentSongsList.length === 0) return;

    let nextIndex;
    const currentIndex = currentSongsList.findIndex(s => s.id === currentSong.id);

    if (isShuffle) {
      do {
        nextIndex = Math.floor(Math.random() * currentSongsList.length);
      } while (nextIndex === currentIndex && currentSongsList.length > 1);
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex >= currentSongsList.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return;
      }
    }

    playSong(currentSongsList[nextIndex]);
  };

  const playPrev = () => {
    if (!currentSong || currentSongsList.length === 0) return;
    
    if (globalAudio.currentTime > 3) {
      globalAudio.currentTime = 0;
      return;
    }

    let prevIndex;
    const currentIndex = currentSongsList.findIndex(s => s.id === currentSong.id);

    if (isShuffle) {
       prevIndex = Math.floor(Math.random() * currentSongsList.length);
    } else {
      prevIndex = currentIndex - 1;
    }

    if (prevIndex < 0) {
      prevIndex = currentSongsList.length - 1; 
    }

    playSong(currentSongsList[prevIndex]);
  };

  const seek = (time) => {
    globalAudio.currentTime = time;
    setProgress(time);
  };

  const changeVolume = (vol) => {
    setVolume(vol);
    globalAudio.volume = vol;
  };

  const toggleShuffle = () => setIsShuffle(!isShuffle);
  
  const toggleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const handleSortChange = (criteria) => {
    setSortBy(criteria);
  };

  return {
    musicPath, playlists, likedSongs, recentlyPlayed, librarySongs,
    currentView, currentSongsList,
    currentSong, isPlaying, volume, progress, duration,
    isShuffle, repeatMode, queue, sortBy,
    actions: {
      selectFolder, importPlaylist, createPlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist, toggleLike,
      setCurrentView, playSong, togglePlay, playNext, playPrev, seek, changeVolume,
      toggleShuffle, toggleRepeat, addToQueue, clearQueue, handleSortChange, loadMoreSongs
    }
  };
};

export default useMusicPlayer;