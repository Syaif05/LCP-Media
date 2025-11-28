// src/hooks/player/useVideoPlayerLogic.js
import { useState, useRef, useEffect, useImperativeHandle } from 'react';

const useVideoPlayerLogic = (ref, { 
  currentVideo, 
  playbackSpeed, 
  onEnded, 
  startTime, 
  onTimeUpdate 
}) => {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    togglePlay: handleTogglePlay,
    seek: (seconds) => handleSeek(seconds),
    setVolume: (change) => handleVolumeChangeManual(change),
    toggleMute: handleToggleMute,
    toggleFullscreen: handleToggleFullscreen
  }));

  // Initial Setup
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      if (startTime > 0) video.currentTime = startTime;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, [currentVideo]);

  // Playback Speed
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed, currentVideo]);

  // Fullscreen Listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handlers
  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVolumeChangeManual = (change) => {
    const newVol = Math.min(Math.max(volume + change, 0), 1);
    setVolume(newVol);
    if (videoRef.current) videoRef.current.volume = newVol;
  };

  const handleTimeUpdateEvent = () => {
    if (videoRef.current) {
      const curr = videoRef.current.currentTime;
      if (!isDragging) {
        setCurrentTime(curr);
      }
      if (onTimeUpdate) onTimeUpdate(curr);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setVolume(videoRef.current.volume);
    }
  };

  const handleSeekChange = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
  };

  const handleSeekMouseDown = () => {
    setIsDragging(true);
  };

  const handleSeekMouseUp = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setIsDragging(false);
    if (isPlaying && videoRef.current.paused) {
      videoRef.current.play();
    }
  };

  const handleVolumeInput = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setIsMuted(vol === 0);
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (newMuted) setVolume(0);
      else setVolume(1);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  const handleMouseLeave = () => {
    if (isPlaying) setShowControls(false);
  };

  return {
    videoRef,
    playerContainerRef,
    state: {
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      showControls,
      isFullscreen
    },
    handlers: {
      handleTogglePlay,
      handleSeek,
      handleSeekChange,
      handleSeekMouseDown,
      handleSeekMouseUp,
      handleVolumeInput,
      handleToggleMute,
      handleToggleFullscreen,
      handleMouseMove,
      handleMouseLeave,
      handleTimeUpdateEvent,
      handleLoadedMetadata
    }
  };
};

export default useVideoPlayerLogic;