// electron/main.js
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static').replace('app.asar', 'app.asar.unpacked');
const ffprobePath = require('ffprobe-static').path.replace('app.asar', 'app.asar.unpacked');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const { 
  addCourse, getCourses, updateVideoData, getVideoData, 
  addVideoAttachment, removeVideoAttachment, updateLastPlayed, 
  resetDatabase, getSettings, saveSettings,
  deleteCourse, renameCourse
} = require('./db');
const { scanDirectory } = require('./utils');

const isDev = !app.isPackaged;
let mainWindow;
let splashWindow;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 340,
    height: 340,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    icon: path.join(__dirname, '../assets/icon.ico'),
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  });
  splashWindow.loadFile(path.join(__dirname, '../splash.html'));
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    icon: path.join(__dirname, '../assets/icon.ico'),
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false 
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      if (splashWindow) { splashWindow.close(); splashWindow = null; }
      mainWindow.show();
    }, 2000);
  });
}

app.whenReady().then(() => {
  createSplashWindow();
  createMainWindow();

  ipcMain.handle('delete-course', (event, courseId) => {
    return deleteCourse(courseId);
  });

  ipcMain.handle('rename-course', (event, { courseId, newTitle }) => {
    return renameCourse(courseId, newTitle);
  });

  ipcMain.handle('check-file-exists', async (event, filePath) => {
    try {
      return fs.existsSync(filePath);
    } catch (error) {
      return false;
    }
  });

  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (result.canceled) return null;
    const folderPath = result.filePaths[0];
    const folderName = path.basename(folderPath);
    const { videos, resources } = scanDirectory(folderPath);
    if (videos.length === 0) return { error: 'No videos found' };
    const newCourse = {
      id: Date.now().toString(),
      title: folderName,
      path: folderPath,
      totalVideos: videos.length,
      progress: 0,
      createdAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString()
    };
    addCourse(newCourse);
    return { course: newCourse, videos, resources };
  });

  ipcMain.handle('get-courses', () => getCourses());
  ipcMain.handle('get-course-videos', (event, folderPath) => scanDirectory(folderPath));
  ipcMain.handle('read-subtitle', (event, filePath) => { try { return fs.readFileSync(filePath, 'utf-8'); } catch (error) { return null; } });
  ipcMain.handle('open-file', async (event, filePath) => { await shell.openPath(filePath); return true; });
  ipcMain.handle('toggle-video-status', (event, data) => updateVideoData(data.coursePath, data.videoId, 'watched', data.status));
  ipcMain.handle('save-video-note', (event, data) => updateVideoData(data.coursePath, data.videoId, 'note', data.note));
  ipcMain.handle('get-video-data', (event, data) => getVideoData(data.coursePath, data.videoId));
  ipcMain.handle('update-last-played', (event, data) => updateLastPlayed(data.coursePath, data.videoId));
  ipcMain.handle('reset-app', () => resetDatabase());
  ipcMain.handle('get-app-path', () => app.getPath('userData'));
  ipcMain.handle('open-path', async (event, fullPath) => await shell.openPath(fullPath));

  ipcMain.handle('add-video-attachment', async (event, { coursePath, videoId }) => {
    const result = await dialog.showOpenDialog({ properties: ['openFile'], title: 'Select File to Attach' });
    if (result.canceled || result.filePaths.length === 0) return null;
    const originalFilePath = result.filePaths[0];
    const originalFileName = path.basename(originalFilePath);
    const fileExt = path.extname(originalFilePath).replace('.', '').toUpperCase();
    const uniqueCode = Math.random().toString(36).substring(2, 7);
    const newFileName = `${uniqueCode}-${originalFileName}`;
    const destinationPath = path.join(coursePath, newFileName);
    try {
      fs.copyFileSync(originalFilePath, destinationPath);
      const fileObj = { name: newFileName, path: destinationPath, type: fileExt };
      return addVideoAttachment(coursePath, videoId, fileObj);
    } catch (error) { return null; }
  });

  ipcMain.handle('remove-video-attachment', (event, { coursePath, videoId, filePath }) => {
    try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (error) {}
    return removeVideoAttachment(coursePath, videoId, filePath);
  });

  ipcMain.handle('get-embedded-subtitles', async (event, videoPath) => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) return resolve([]);
        const subtitleStreams = metadata.streams.filter(s => s.codec_type === 'subtitle').map(s => ({
            index: s.index, language: s.tags?.language || 'unknown', title: s.tags?.title || s.tags?.language || `Track ${s.index}`, codec: s.codec_name
          }));
        resolve(subtitleStreams);
      });
    });
  });

  ipcMain.handle('extract-embedded-subtitle', async (event, { videoPath, streamIndex }) => {
    const tempDir = os.tmpdir();
    const outputPath = path.join(tempDir, `sub_${Date.now()}_${streamIndex}.vtt`);
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath).outputOptions([`-map 0:${streamIndex}`, '-f webvtt']).save(outputPath)
        .on('end', () => { fs.readFile(outputPath, 'utf-8', (err, data) => { if (err) resolve(null); else resolve(data); fs.unlink(outputPath, () => {}); }); })
        .on('error', (err) => { resolve(null); });
    });
  });

  ipcMain.handle('get-settings', () => getSettings());
  ipcMain.handle('save-settings', (event, newSettings) => { saveSettings(newSettings); return true; });
  ipcMain.handle('select-download-dir', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (result.canceled) return null;
    return result.filePaths[0];
  });
  
  ipcMain.handle('get-downloads-info', () => {
    const { downloadPath } = getSettings();
    try {
      if (!fs.existsSync(downloadPath)) return { files: [], usedSpace: '0 MB' };
      const files = fs.readdirSync(downloadPath).map(file => {
        const filePath = path.join(downloadPath, file);
        return { name: file, path: filePath, size: 'Unknown' }; 
      });
      return { files, usedSpace: 'Calculated', path: downloadPath };
    } catch (error) { return { files: [], usedSpace: '0 MB', path: downloadPath }; }
  });

  ipcMain.handle('delete-download', (event, filePath) => {
    try { if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); return true; } } catch (error) { return false; }
    return false;
  });

  ipcMain.handle('start-download', async (event, { sourcePath, destinationPath }) => {
    try {
      const targetDir = path.dirname(destinationPath);
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

      const stat = fs.statSync(sourcePath);
      const fileSize = stat.size;
      let copiedSize = 0;
      let startTime = Date.now();

      const readStream = fs.createReadStream(sourcePath);
      const writeStream = fs.createWriteStream(destinationPath);

      readStream.on('data', (chunk) => {
        copiedSize += chunk.length;
        const percent = Math.round((copiedSize / fileSize) * 100);
        const elapsedTime = (Date.now() - startTime) / 1000;
        const speed = (copiedSize / 1024 / 1024) / elapsedTime;

        mainWindow.webContents.send('download-progress', {
          percent,
          speed: speed.toFixed(1) + ' MB/s',
          downloaded: (copiedSize / 1024 / 1024).toFixed(1) + ' MB',
          total: (fileSize / 1024 / 1024).toFixed(1) + ' MB'
        });
      });

      return new Promise((resolve, reject) => {
        writeStream.on('finish', () => resolve(true));
        writeStream.on('error', (err) => reject(err));
        readStream.pipe(writeStream);
      });
    } catch (error) {
      console.error(error);
      return false;
    }
  });

  ipcMain.handle('open-external', async (event, url) => {
    if (!url) return false;
    try {
      await shell.openExternal(url);
      return true;
    } catch (e) {
      return false;
    }
  });

  ipcMain.on('window-min', () => mainWindow.minimize());
  ipcMain.on('window-max', () => { if (mainWindow.isMaximized()) mainWindow.unmaximize(); else mainWindow.maximize(); });
  ipcMain.on('window-close', () => mainWindow.close());

  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createMainWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
