// src/components/player/video-parts/VideoPlayer.jsx
import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

const VideoPlayer = ({ currentVideo, subtitleUrl, subSettings, playbackSpeed, onEnded, isExtractingSub }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideo]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed, currentVideo]);

  return (
    <div className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 relative group">
      <div className="aspect-video w-full relative bg-black">
        {currentVideo ? (
          <video 
            ref={videoRef}
            controls 
            className="w-full h-full object-contain"
            src={`file://${currentVideo.path}`}
            onEnded={onEnded}
            crossOrigin="anonymous"
          >
            {subtitleUrl && <track kind="subtitles" src={subtitleUrl} default={subSettings.enabled} />}
          </video>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600">Loading Player...</div>
        )}

        {isExtractingSub && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/10 z-20">
            <Loader2 size={14} className="text-orange-500 animate-spin" />
            <span className="text-xs text-white font-medium">Extracting Subtitles...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;