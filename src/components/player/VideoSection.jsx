// src/components/player/VideoSection.jsx
import React, { useEffect } from 'react';
import VideoHeader from './video-parts/VideoHeader';
import VideoPlayer from './video-parts/VideoPlayer';
import VideoControls from './video-parts/VideoControls';

const VideoSection = ({ 
  currentVideo, subtitleUrl, onEnded, playbackSpeed, onSpeedChange,
  isSidebarCollapsed, toggleSidebar, subSettings, setSubSettings,
  subtitleTracks, selectedTrackIndex, onTrackChange, isExtractingSub,
  isCloudFile, isDownloaded, onDownloadLocal
}) => {

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
    <div className="flex flex-col gap-3">
      <VideoHeader 
        currentVideo={currentVideo} 
        onDownloadLocal={onDownloadLocal} 
      />
      
      <VideoPlayer 
        currentVideo={currentVideo}
        subtitleUrl={subtitleUrl}
        subSettings={subSettings}
        playbackSpeed={playbackSpeed}
        onEnded={onEnded}
        isExtractingSub={isExtractingSub}
      />

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
    </div>
  );
};

export default VideoSection;