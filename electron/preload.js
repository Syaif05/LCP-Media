// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getCourses: () => ipcRenderer.invoke('get-courses'),
  deleteCourse: (id) => ipcRenderer.invoke('delete-course', id),
  renameCourse: (data) => ipcRenderer.invoke('rename-course', data),
  getCourseVideos: (path) => ipcRenderer.invoke('get-course-videos', path),
  readSubtitle: (path) => ipcRenderer.invoke('read-subtitle', path),
  toggleVideoStatus: (data) => ipcRenderer.invoke('toggle-video-status', data),
  saveVideoNote: (data) => ipcRenderer.invoke('save-video-note', data),
  saveVideoTime: (data) => ipcRenderer.invoke('save-video-time', data),
  getVideoData: (data) => ipcRenderer.invoke('get-video-data', data),
  openFile: (path) => ipcRenderer.invoke('open-file', path),
  addVideoAttachment: (data) => ipcRenderer.invoke('add-video-attachment', data),
  removeVideoAttachment: (data) => ipcRenderer.invoke('remove-video-attachment', data),
  updateLastPlayed: (data) => ipcRenderer.invoke('update-last-played', data),
  resetApp: () => ipcRenderer.invoke('reset-app'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  openPath: (path) => ipcRenderer.invoke('open-path', path),
  getEmbeddedSubtitles: (path) => ipcRenderer.invoke('get-embedded-subtitles', path),
  extractEmbeddedSubtitle: (data) => ipcRenderer.invoke('extract-embedded-subtitle', data),

  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  selectDownloadDir: () => ipcRenderer.invoke('select-download-dir'),
  getDownloadsInfo: () => ipcRenderer.invoke('get-downloads-info'),
  deleteDownload: (path) => ipcRenderer.invoke('delete-download', path),
  startDownload: (data) => ipcRenderer.invoke('start-download', data),
  checkFileExists: (path) => ipcRenderer.invoke('check-file-exists', path),

  // Listener Baru untuk Open With
  onOpenFileDirect: (callback) => ipcRenderer.on('open-file-direct', (event, filePath) => callback(filePath)),

  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (event, data) => callback(data)),
  removeDownloadListener: () => ipcRenderer.removeAllListeners('download-progress'),

  minimize: () => ipcRenderer.send('window-min'),
  maximize: () => ipcRenderer.send('window-max'),
  close: () => ipcRenderer.send('window-close'),

  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  platform: process.platform
});