// src/components/player/video-parts/VideoPlayer.jsx
import React, { forwardRef } from 'react';
import { Loader2, Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw, RotateCw } from 'lucide-react';
import { formatTime } from '../../../utils/formatTime';
import useVideoPlayerLogic from '../../../hooks/player/useVideoPlayerLogic';

const VideoPlayer = forwardRef(({ 
  currentVideo, 
  subtitleUrl, 
  subSettings, 
  playbackSpeed, 
  onEnded, 
  isExtractingSub,
  startTime,
  onTimeUpdate
}, ref) => {
  
  const { 
    videoRef, 
    playerContainerRef, 
    state, 
    handlers 
  } = useVideoPlayerLogic(ref, { 
    currentVideo, 
    playbackSpeed, 
    onEnded, 
    startTime, 
    onTimeUpdate 
  });

  const { isPlaying, currentTime, duration, volume, isMuted, showControls, isFullscreen } = state;
  const { 
    handleTogglePlay, handleSeek, handleSeekChange, handleSeekMouseDown, 
    handleSeekMouseUp, handleVolumeInput, handleToggleMute, handleToggleFullscreen,
    handleMouseMove, handleMouseLeave, handleTimeUpdateEvent, handleLoadedMetadata 
  } = handlers;

  const getVideoSrc = (path) => {
    if (!path) return '';
    const normalizedPath = path.replace(/\\/g, '/');
    return `lcp://${encodeURIComponent(normalizedPath)}`;
  };

  const containerClasses = isFullscreen 
    ? "w-full h-full bg-black relative group select-none flex justify-center items-center outline-none" 
    : "w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 relative group select-none outline-none";

  return (
    <div 
      ref={playerContainerRef}
      className={containerClasses}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
    >
      <div className={`relative bg-black flex justify-center items-center ${isFullscreen ? 'w-full h-full' : 'aspect-video w-full'}`}>
        
        {currentVideo ? (
          <video 
            ref={videoRef}
            className="w-full h-full object-contain focus:outline-none"
            src={getVideoSrc(currentVideo.path)}
            onEnded={() => { handlers.handleTogglePlay(); onEnded(); }} // Stop UI play state
            onTimeUpdate={handleTimeUpdateEvent}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={handleTogglePlay}
            onDoubleClick={handleToggleFullscreen}
            crossOrigin="anonymous"
          >
            {subtitleUrl && <track kind="subtitles" src={subtitleUrl} default={subSettings.enabled} />}
          </video>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600">Loading Player...</div>
        )}

        {isExtractingSub && (
          <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 border border-white/10 z-30 shadow-lg">
            <Loader2 size={16} className="text-orange-500 animate-spin" />
            <span className="text-xs text-white font-medium tracking-wide">Processing Subtitles...</span>
          </div>
        )}

        {!isPlaying && currentVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10 z-10">
            <div className="bg-black/40 backdrop-blur-sm p-5 rounded-full border border-white/10 shadow-2xl scale-110">
               <Play size={48} className="text-white fill-white ml-1" />
            </div>
          </div>
        )}

        <div className={`absolute bottom-0 left-0 right-0 px-4 pb-4 pt-16 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 flex flex-col gap-2 z-20 ${showControls ? 'opacity-100' : 'opacity-0 cursor-none'}`}>
          
          <div className="group/seekbar relative h-1.5 hover:h-2.5 transition-all bg-white/20 rounded-full cursor-pointer touch-none">
             <div 
               className="absolute top-0 left-0 h-full bg-orange-500 rounded-full pointer-events-none" 
               style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
             ></div>
             <input 
               type="range" 
               min="0" 
               max={duration || 0} 
               step="any"
               value={currentTime} 
               onChange={handleSeekChange}
               onMouseDown={handleSeekMouseDown}
               onMouseUp={handleSeekMouseUp}
               onTouchStart={handleSeekMouseDown}
               onTouchEnd={handleSeekMouseUp}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             />
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-4">
              <button onClick={handleTogglePlay} className="text-white hover:text-orange-400 transition-colors focus:outline-none">
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </button>

              <div className="flex items-center gap-2">
                <button onClick={() => handleSeek(-10)} className="text-slate-300 hover:text-white transition-colors focus:outline-none" title="Rewind 10s">
                  <RotateCcw size={20} />
                </button>
                <button onClick={() => handleSeek(10)} className="text-slate-300 hover:text-white transition-colors focus:outline-none" title="Forward 10s">
                  <RotateCw size={20} />
                </button>
              </div>
              
              <div className="flex items-center gap-2 group/volume">
                <button onClick={handleToggleMute} className="text-white hover:text-gray-300 transition-colors focus:outline-none">
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                   <input 
                     type="range" 
                     min="0" 
                     max="1" 
                     step="0.05"
                     value={isMuted ? 0 : volume}
                     onChange={handleVolumeInput}
                     className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-orange-500"
                   />
                </div>
              </div>

              <div className="text-xs font-medium text-white/90 font-mono tracking-wide">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-3">
               <button onClick={handleToggleFullscreen} className="text-white hover:text-orange-400 transition-colors focus:outline-none">
                 {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;