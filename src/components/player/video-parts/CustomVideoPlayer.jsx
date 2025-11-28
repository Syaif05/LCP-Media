// src/components/player/video-parts/CustomVideoPlayer.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomVideoPlayer = ({ 
  currentVideo, 
  subtitleUrl, 
  subSettings, 
  playbackSpeed, 
  onEnded, 
  isExtractingSub,
  startTime = 0, // Props baru: Waktu mulai
  onTimeUpdate   // Callback simpan waktu
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const controlsTimeoutRef = useRef(null);

  // Format Waktu (00:00)
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Convert Path ke Protocol Aman
  const getVideoSrc = (path) => {
    // Jika path windows (C:\...), ubah jadi lcp://C:/...
    // Perbaikan slash untuk windows
    const normalizedPath = path.replace(/\\/g, '/');
    return `lcp://${normalizedPath}`;
  };

  // Init Video & Resume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      // Set initial time
      if (startTime > 0) {
        videoRef.current.currentTime = startTime;
      }
      // Auto play
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentVideo]);

  // Handle Playback Speed
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Jangan trigger jika sedang ngetik di Notes
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

      switch(e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          videoRef.current.currentTime += 5;
          break;
        case 'ArrowLeft':
          videoRef.current.currentTime -= 5;
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange({ target: { value: Math.min(volume + 0.1, 1) } });
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange({ target: { value: Math.max(volume - 0.1, 0) } });
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        case 'KeyM':
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [volume, isPlaying]);

  // Mouse Move Interaction (Show/Hide Controls)
  const handleMouseMove = () => {
    setShowControls(true);
    document.body.style.cursor = 'default';
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        document.body.style.cursor = 'none'; // Sembunyikan cursor
      }
    }, 2500);
  };

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    if (onTimeUpdate) onTimeUpdate(videoRef.current.currentTime);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    videoRef.current.volume = newVol;
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 relative group select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className="aspect-video w-full relative bg-black flex items-center justify-center">
        {currentVideo ? (
          <video 
            ref={videoRef}
            className="w-full h-full object-contain"
            src={getVideoSrc(currentVideo.path)} // Pake Protocol lcp://
            onEnded={() => { setIsPlaying(false); onEnded(); setShowControls(true); }}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDuration(videoRef.current.duration)}
            crossOrigin="anonymous"
            onClick={togglePlay}
          >
            {subtitleUrl && <track kind="subtitles" src={subtitleUrl} default={subSettings.enabled} />}
          </video>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600 gap-2">
             <Loader2 className="animate-spin" /> Loading...
          </div>
        )}

        {/* LOADING INDICATOR SUBTITLE */}
        <AnimatePresence>
          {isExtractingSub && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute top-6 left-6 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 z-20"
            >
              <Loader2 size={16} className="text-orange-500 animate-spin" />
              <span className="text-xs text-white font-medium">Extracting Subtitles...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PLAY/PAUSE CENTER ICON (Animation) */}
        <AnimatePresence>
           {!isPlaying && currentVideo && (
             <motion.div 
               initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}
               className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
             >
                <div className="bg-black/50 p-6 rounded-full backdrop-blur-sm">
                   <Play size={48} fill="white" className="text-white ml-1" />
                </div>
             </motion.div>
           )}
        </AnimatePresence>

        {/* CUSTOM CONTROLS OVERLAY */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-20 pb-4 px-4 z-20 flex flex-col gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
           {/* PROGRESS BAR */}
           <div className="flex items-center gap-3 group/slider">
              <input 
                type="range" 
                min="0" max={duration || 0} step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:opacity-0 group-hover/slider:[&::-webkit-slider-thumb]:opacity-100 transition-all hover:h-1.5"
                style={{
                    backgroundImage: `linear-gradient(to right, #f97316 ${(currentTime/duration)*100}%, rgba(255,255,255,0.2) ${(currentTime/duration)*100}%)`
                }}
              />
           </div>

           {/* BUTTONS ROW */}
           <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                 <button onClick={togglePlay} className="hover:text-orange-500 transition-colors">
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                 </button>
                 
                 <div className="flex items-center gap-2 group/vol">
                    <button onClick={toggleMute} className="hover:text-orange-500 transition-colors">
                       {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input 
                      type="range" min="0" max="1" step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                 </div>

                 <div className="text-xs font-medium font-mono text-white/80">
                    {formatTime(currentTime)} / {formatTime(duration)}
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <button onClick={toggleFullscreen} className="hover:text-orange-500 transition-colors">
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                 </button>
              </div>
           </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CustomVideoPlayer;