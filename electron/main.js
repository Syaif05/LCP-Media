// electron/main.js
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static').replace('app.asar', 'app.asar.unpacked');
const ffprobePath = require('ffprobe-static').path.replace('app.asar', 'app.asar.unpacked');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const { registerSchemes, setupProtocolHandler } = require('./handlers/protocol');
const { setupIPC } = require('./handlers/ipc');

registerSchemes();

const isDev = !app.isPackaged;
let mainWindow;
let fileToOpen = null;

if (process.platform === 'win32' && process.argv.length >= 2) {
  const openFilePath = process.argv[1];
  if (openFilePath && !openFilePath.startsWith('--')) {
    try {
      const stat = fs.statSync(openFilePath);
      if (stat.isFile()) {
        fileToOpen = openFilePath;
      }
    } catch (e) {
      // Ignore invalid paths
    }
  }
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      
      const secondFilePath = commandLine[commandLine.length - 1];
      if (secondFilePath && !secondFilePath.startsWith('--')) {
         try {
           if (fs.statSync(secondFilePath).isFile()) {
             mainWindow.webContents.send('open-file-direct', secondFilePath);
           }
         } catch (e) {}
      }
    }
  });

  app.whenReady().then(() => {
    setupProtocolHandler();
    createSplashWindow();
    createMainWindow();

    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createMainWindow(); });
  });
}

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
    backgroundColor: '#18181b',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
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
      
      if (fileToOpen) {
        mainWindow.webContents.send('open-file-direct', fileToOpen);
      }
    }, 2000);
  });
  
  setupIPC(mainWindow);
}

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });