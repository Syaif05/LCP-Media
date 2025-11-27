// src/components/CoursePlayer.jsx
import React from 'react';
import useCoursePlayer from '../hooks/useCoursePlayer';
import PlayerHeader from './player/PlayerHeader';
import VideoSection from './player/VideoSection';
import TabsSection from './player/TabsSection';
import PlaylistSidebar from './player/PlaylistSidebar';
import DownloadModal from './modals/DownloadModal';

const CoursePlayer = ({ course, onBack, isSidebarCollapsed, toggleSidebar }) => {
  const { state, actions } = useCoursePlayer(course);

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

  return (
    <div className="flex flex-col h-full">
      <PlayerHeader 
        course={course} 
        onBack={onBack}
        watchedCount={Object.values(state.watchedVideos).filter(v => v.watched).length}
        totalVideos={state.videos.length}
      />

      <div className="flex flex-col lg:flex-row flex-1 gap-6 overflow-hidden">
        <div className={`flex flex-col overflow-hidden gap-4 transition-all duration-300 ${isSidebarCollapsed ? 'flex-[4]' : 'flex-[3]'}`}>
          <VideoSection 
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