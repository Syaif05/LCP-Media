// src/components/player/VideoSection.jsx
import React, { useEffect, forwardRef } from 'react';
import { PictureInPicture2 } from 'lucide-react'; // Ganti Pip dengan PictureInPicture2
import VideoHeader from './video-parts/VideoHeader';
import VideoPlayer from './video-parts/VideoPlayer';
import VideoControls from './video-parts/VideoControls';

const VideoSection = forwardRef(({ 
  currentVideo, subtitleUrl, onEnded, playbackSpeed, onSpeedChange,
  isSidebarCollapsed, toggleSidebar, subSettings, setSubSettings,
  subtitleTracks, selectedTrackIndex, onTrackChange, isExtractingSub,
  isCloudFile, isDownloaded, onDownloadLocal, startTime, onTimeUpdate,
  isMiniMode, onToggleMiniMode
}, ref) => {

  useEffect(() => {
    const styleId = 'dynamic-subtitle-style';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    const getSizeInVh = (size) => {
      switch(size) {
        case 'Small': return '2.5vh';
        case 'Medium': return '3.5vh';
        case 'Large': return '5vh';
        default: return '3.5vh';
      }
    };

    if (subSettings.enabled) {
      styleTag.innerHTML = `
        video::cue {
          font-size: ${getSizeInVh(subSettings.size)} !important;
          color: ${subSettings.color} !important;
          background-color: ${subSettings.bg} !important;
          border-radius: 4px;
          text-shadow: 0px 2px 4px rgba(0,0,0,0.8); 
        }
      `;
    } else {
      styleTag.innerHTML = `video::cue { display: none !important; }`;
    }
  }, [subSettings]);

  return (
    <div className={`flex flex-col gap-3 ${isMiniMode ? 'h-full w-full' : ''}`}>
      {!isMiniMode && (
        <div className="flex justify-between items-center">
           <VideoHeader currentVideo={currentVideo} onDownloadLocal={onDownloadLocal} />
           <button 
             onClick={onToggleMiniMode}
             className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/10 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-orange-500 hover:text-white transition-colors"
             title="Mini Player Mode"
           >
             <PictureInPicture2 size={16} /> Mini Player
           </button>
        </div>
      )}
      
      <div className={`relative ${isMiniMode ? 'h-full w-full' : ''}`}>
        <VideoPlayer 
          ref={ref}
          currentVideo={currentVideo}
          subtitleUrl={subtitleUrl}
          subSettings={subSettings}
          playbackSpeed={playbackSpeed}
          onEnded={onEnded}
          isExtractingSub={isExtractingSub}
          startTime={startTime}
          onTimeUpdate={onTimeUpdate}
        />
      </div>

      {!isMiniMode && (
        <VideoControls 
          playbackSpeed={playbackSpeed}
          onSpeedChange={onSpeedChange}
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          subSettings={subSettings}
          setSubSettings={setSubSettings}
          subtitleTracks={subtitleTracks}
          selectedTrackIndex={selectedTrackIndex}
          onTrackChange={onTrackChange}
        />
      )}
    </div>
  );
});

VideoSection.displayName = "VideoSection";

export default VideoSection;