// src/hooks/useCoursePlayer.js
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const useCoursePlayer = (course) => {
  const { t } = useTranslation();
  
  const [videos, setVideos] = useState([]);
  const [resources, setResources] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [subtitleUrl, setSubtitleUrl] = useState(null);
  
  const [subtitleTracks, setSubtitleTracks] = useState([]); 
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(-1); 
  const [isExtractingSub, setIsExtractingSub] = useState(false);
  
  const [watchedVideos, setWatchedVideos] = useState({}); 
  const [currentNote, setCurrentNote] = useState('');
  const [videoAttachments, setVideoAttachments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [subSettings, setSubSettings] = useState({
    size: 'Medium',
    color: '#ffffff',
    bg: 'rgba(0,0,0,0.7)',
    enabled: true
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadSettings, setDownloadSettings] = useState(null);

  const timeoutRef = useRef(null); 
  const timeSaveRef = useRef(null);

  useEffect(() => {
    window.electron.getSettings().then(setDownloadSettings);
  }, []);

  useEffect(() => {
    if (downloadSettings) {
      loadVideos();
    }
    return () => {
      if (subtitleUrl) URL.revokeObjectURL(subtitleUrl);
    };
  }, [course, downloadSettings]);

  useEffect(() => {
    const initVideo = async () => {
      if (currentVideo) {
        const data = watchedVideos[currentVideo.id] || { note: '', attachments: [], currentTime: 0 };
        setCurrentNote(data.note || '');
        setVideoAttachments(data.attachments || []);
        
        setSubtitleUrl(null);
        setSubtitleTracks([]);
        setSelectedTrackIndex(-1);

        if (currentVideo.subtitle) {
          const srtContent = await window.electron.readSubtitle(currentVideo.subtitle);
          if (srtContent) {
            setSubtitleTracks(prev => [{ index: 'external', title: 'External (SRT)', language: 'en', type: 'external', content: srtContent }]);
            loadSubtitleBlob(srtContent);
            setSelectedTrackIndex('external');
          }
        }

        window.electron.getEmbeddedSubtitles(currentVideo.path).then(embedded => {
          if (embedded && embedded.length > 0) {
            setSubtitleTracks(prev => {
              const tracks = [...prev];
              embedded.forEach(track => {
                 tracks.push({ ...track, type: 'embedded' });
              });
              return tracks;
            });
          }
        });

        window.electron.updateLastPlayed({
          coursePath: course.path,
          videoId: currentVideo.id
        });
      }
    };
    initVideo();
  }, [currentVideo, watchedVideos]);

  const loadVideos = async () => {
    const { videos: rawVideos, resources: resourceList } = await window.electron.getCourseVideos(course.path);
    
    const processedVideos = await Promise.all(rawVideos.map(async (vid) => {
      const localPath = `${downloadSettings.downloadPath}\\${course.title}\\${vid.name}`;
      const isLocalExist = await window.electron.checkFileExists(localPath);

      if (isLocalExist) {
        return {
          ...vid,
          path: localPath,
          originalPath: vid.path,
          isDownloaded: true,
          isCloud: false
        };
      } else {
        return {
          ...vid,
          isDownloaded: false,
          isCloud: vid.path.includes('Google Drive') || vid.path.match(/^[G-Z]:/)
        };
      }
    }));

    setVideos(processedVideos);
    setResources(resourceList);
    
    const statusMap = {};
    for (const vid of processedVideos) {
      const data = await window.electron.getVideoData({ coursePath: course.path, videoId: vid.id });
      statusMap[vid.id] = data;
    }
    setWatchedVideos(statusMap);

    if (processedVideos.length > 0) {
      if (course.lastPlayedVideoId) {
        const lastVideo = processedVideos.find(v => v.id === course.lastPlayedVideoId);
        setCurrentVideo(lastVideo || processedVideos[0]);
      } else {
        setCurrentVideo(processedVideos[0]);
      }
    }
  };

  const loadSubtitleBlob = (content) => {
    if (subtitleUrl) URL.revokeObjectURL(subtitleUrl);
    const vttContent = content.includes('WEBVTT') ? content : "WEBVTT\n\n" + content.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
    const blob = new Blob([vttContent], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);
    setSubtitleUrl(url);
    setSubSettings(prev => ({ ...prev, enabled: true }));
  };

  const handleTrackChange = async (trackIndex) => {
    setSelectedTrackIndex(trackIndex);
    if (trackIndex === -1) {
      setSubtitleUrl(null);
      setSubSettings(prev => ({ ...prev, enabled: false }));
      return;
    }
    const track = subtitleTracks.find(t => t.index === trackIndex);
    if (!track) return;

    if (track.type === 'external') {
      loadSubtitleBlob(track.content);
      toast.success(t('toast.subLoaded'));
    } else {
      setIsExtractingSub(true);
      const loadingToast = toast.loading("Extracting subtitle...");
      try {
        const vttData = await window.electron.extractEmbeddedSubtitle({
          videoPath: currentVideo.path,
          streamIndex: track.index
        });
        if (vttData) {
          loadSubtitleBlob(vttData);
          toast.success(t('toast.subExtracted'));
        } else {
          toast.error(t('toast.subFailed'));
        }
      } catch (err) {
        toast.error(t('toast.subFailed'));
      } finally {
        toast.dismiss(loadingToast);
        setIsExtractingSub(false);
      }
    }
  };

  const confirmDownload = async () => {
    if (!currentVideo || !downloadSettings) return;
    setIsDownloading(true);
    const targetPath = `${downloadSettings.downloadPath}\\${course.title}\\${currentVideo.name}`;
    const removeListener = window.electron.onDownloadProgress((progressData) => {
      setDownloadProgress(progressData);
    });

    toast.info(t('toast.downloadStarted'));

    try {
      const sourcePath = currentVideo.originalPath || currentVideo.path;
      await window.electron.startDownload({ sourcePath, destinationPath: targetPath });
      await loadVideos(); 
      toast.success(t('toast.downloadSuccess'));
    } catch (e) {
      console.error(e);
      toast.error(t('toast.downloadFailed'));
    } finally {
      setIsDownloading(false);
      removeListener();
    }
  };

  const handleVideoChange = (video) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentVideo(video);
  };

  const toggleWatched = async (videoId) => {
    const newStatus = !watchedVideos[videoId]?.watched;
    setWatchedVideos(prev => ({ ...prev, [videoId]: { ...prev[videoId], watched: newStatus } }));
    await window.electron.toggleVideoStatus({ coursePath: course.path, videoId, status: newStatus });
    if(newStatus) toast.success(t('toast.markedWatched'));
  };

  const handleNoteChange = (e) => {
    const text = e.target.value;
    setCurrentNote(text);
    setIsSaving(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      await window.electron.saveVideoNote({ coursePath: course.path, videoId: currentVideo.id, note: text });
      setWatchedVideos(prev => ({ ...prev, [currentVideo.id]: { ...prev[currentVideo.id], note: text } }));
      setIsSaving(false);
    }, 1000); 
  };

  const handleTimeUpdate = (currentTime) => {
    if (timeSaveRef.current) clearTimeout(timeSaveRef.current);
    timeSaveRef.current = setTimeout(async () => {
      await window.electron.saveVideoTime({ 
        coursePath: course.path, 
        videoId: currentVideo.id, 
        time: currentTime 
      });
    }, 2000); 
  };

  const handleAddAttachment = async () => {
    const newAttachments = await window.electron.addVideoAttachment({ coursePath: course.path, videoId: currentVideo.id });
    if (newAttachments) {
      setVideoAttachments(newAttachments);
      setWatchedVideos(prev => ({ ...prev, [currentVideo.id]: { ...prev[currentVideo.id], attachments: newAttachments } }));
      toast.success(t('toast.fileAttached'));
    }
  };

  const handleRemoveAttachment = async (filePath) => {
    const newAttachments = await window.electron.removeVideoAttachment({ coursePath: course.path, videoId: currentVideo.id, filePath });
    setVideoAttachments(newAttachments);
    setWatchedVideos(prev => ({ ...prev, [currentVideo.id]: { ...prev[currentVideo.id], attachments: newAttachments } }));
    toast.success(t('toast.fileRemoved'));
  };

  return {
    state: {
      videos, resources, currentVideo, activeTab, subtitleUrl,
      watchedVideos, currentNote, videoAttachments, isSaving, playbackSpeed,
      subSettings, subtitleTracks, selectedTrackIndex, isExtractingSub,
      isDownloading, downloadProgress, showDownloadModal, downloadSettings
    },
    actions: {
      setPlaybackSpeed, setSubSettings, setActiveTab, setCurrentNote,
      setShowDownloadModal, setDownloadProgress, setIsDownloading,
      handleVideoChange, toggleWatched, handleNoteChange, handleAddAttachment,
      handleRemoveAttachment, handleTrackChange, confirmDownload, handleTimeUpdate
    }
  };
};

export default useCoursePlayer;