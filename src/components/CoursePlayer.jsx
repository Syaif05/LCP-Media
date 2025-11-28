// src/components/CoursePlayer.jsx
import React, { useRef } from 'react';
import useCoursePlayer from '../hooks/useCoursePlayer';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import PlayerHeader from './player/PlayerHeader';
import VideoSection from './player/VideoSection';
import TabsSection from './player/TabsSection';
import PlaylistSidebar from './player/PlaylistSidebar';
import DownloadModal from './modals/DownloadModal';

const CoursePlayer = ({ 
  course, 
  onBack, 
  isSidebarCollapsed, 
  toggleSidebar, 
  isMiniMode, 
  onToggleMiniMode 
}) => {
  const { state, actions } = useCoursePlayer(course);
  const playerRef = useRef(null);

  useKeyboardShortcuts({
    togglePlay: () => playerRef.current?.togglePlay(),
    seekForward: () => playerRef.current?.seek(5),
    seekBackward: () => playerRef.current?.seek(-5),
    increaseVolume: () => playerRef.current?.setVolume(0.1),
    decreaseVolume: () => playerRef.current?.setVolume(-0.1),
    toggleMute: () => playerRef.current?.toggleMute(),
    toggleFullscreen: () => playerRef.current?.toggleFullscreen(),
  });

  const handleCloseModal = () => {
    if (!state.isDownloading) {
      actions.setShowDownloadModal(false);
      actions.setDownloadProgress(null);
    }
    if (state.downloadProgress?.percent === 100) {
       actions.setShowDownloadModal(false);
       actions.setIsDownloading(false);
       actions.setDownloadProgress(null);
    }
  };

  const handleDownloadClick = () => {
    actions.setShowDownloadModal(true);
  };

  const startTime = state.currentVideo && state.watchedVideos[state.currentVideo.id] 
    ? (state.watchedVideos[state.currentVideo.id].currentTime || 0) 
    : 0;

  // --- TAMPILAN MINI MODE ---
  if (isMiniMode) {
    return (
      <div className="w-full h-full bg-black group relative">
        <VideoSection 
            ref={playerRef}
            currentVideo={state.currentVideo}
            subtitleUrl={state.subtitleUrl}
            onEnded={() => actions.toggleWatched(state.currentVideo.id)}
            playbackSpeed={state.playbackSpeed}
            onSpeedChange={actions.setPlaybackSpeed}
            isSidebarCollapsed={true}
            toggleSidebar={() => {}}
            subSettings={state.subSettings}
            setSubSettings={actions.setSubSettings}
            subtitleTracks={state.subtitleTracks}
            selectedTrackIndex={state.selectedTrackIndex}
            onTrackChange={actions.handleTrackChange}
            isExtractingSub={state.isExtractingSub}
            isCloudFile={state.currentVideo?.isCloud}
            isDownloaded={state.currentVideo?.isDownloaded}
            onDownloadLocal={handleDownloadClick}
            startTime={startTime}
            onTimeUpdate={actions.handleTimeUpdate}
            isMiniMode={true} 
            onToggleMiniMode={onToggleMiniMode}
          />
          <button 
            onClick={onToggleMiniMode} 
            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 text-xs"
          >
            Expand
          </button>
      </div>
    );
  }

  // --- TAMPILAN NORMAL ---
  return (
    <div className="flex flex-col h-full overflow-hidden p-1">
      <PlayerHeader 
        course={course} 
        onBack={onBack}
        watchedCount={Object.values(state.watchedVideos).filter(v => v.watched).length}
        totalVideos={state.videos.length}
      />

      <div className="flex flex-col lg:flex-row flex-1 gap-4 overflow-hidden mt-2 h-full">
        <div className={`flex flex-col overflow-hidden gap-4 transition-all duration-300 ${isSidebarCollapsed ? 'flex-[4]' : 'flex-[3]'}`}>
          <VideoSection 
            ref={playerRef}
            currentVideo={state.currentVideo}
            subtitleUrl={state.subtitleUrl}
            onEnded={() => actions.toggleWatched(state.currentVideo.id)}
            playbackSpeed={state.playbackSpeed}
            onSpeedChange={actions.setPlaybackSpeed}
            isSidebarCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            subSettings={state.subSettings}
            setSubSettings={actions.setSubSettings}
            subtitleTracks={state.subtitleTracks}
            selectedTrackIndex={state.selectedTrackIndex}
            onTrackChange={actions.handleTrackChange}
            isExtractingSub={state.isExtractingSub}
            isCloudFile={state.currentVideo?.isCloud}
            isDownloaded={state.currentVideo?.isDownloaded}
            onDownloadLocal={handleDownloadClick}
            startTime={startTime}
            onTimeUpdate={actions.handleTimeUpdate}
            onToggleMiniMode={onToggleMiniMode}
          />

          <TabsSection 
            activeTab={state.activeTab}
            onTabChange={actions.setActiveTab}
            note={state.currentNote}
            onNoteChange={actions.handleNoteChange}
            isSaving={state.isSaving}
            resources={state.resources}
            videoAttachments={state.videoAttachments}
            onAddAttachment={actions.handleAddAttachment}
            onRemoveAttachment={actions.handleRemoveAttachment}
          />
        </div>

        {/* CONTAINER SIDEBAR HARUS MEMILIKI TINGGI */}
        <div className="flex-1 min-w-[300px] flex flex-col overflow-hidden h-full">
           <PlaylistSidebar 
            videos={state.videos}
            currentVideo={state.currentVideo}
            watchedVideos={state.watchedVideos}
            onVideoChange={actions.handleVideoChange}
            onToggleWatched={actions.toggleWatched}
          />
        </div>
      </div>

      <DownloadModal 
        isOpen={state.showDownloadModal}
        onClose={handleCloseModal}
        onConfirm={actions.confirmDownload}
        isDownloading={state.isDownloading}
        progress={state.downloadProgress}
        fileInfo={{
          name: state.currentVideo?.name,
          targetDir: `${state.downloadSettings?.downloadPath}\\${course.title}`
        }}
      />
    </div>
  );
};

export default CoursePlayer;