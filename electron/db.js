// electron/db.js
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'courses-data.json');
const settingsPath = path.join(userDataPath, 'settings.json');

// Default Download Path
const defaultDownloadPath = path.join(app.getPath('videos'), 'LCP_Downloads');

function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      const initialData = { courses: [] };
      fs.writeFileSync(dbPath, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch (error) {
    return { courses: [] };
  }
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// SETTINGS FUNCTIONS
function getSettings() {
  try {
    if (!fs.existsSync(settingsPath)) {
      const defaultSettings = { downloadPath: defaultDownloadPath };
      // Buat folder jika belum ada
      if (!fs.existsSync(defaultDownloadPath)) fs.mkdirSync(defaultDownloadPath, { recursive: true });
      fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  } catch (error) {
    return { downloadPath: defaultDownloadPath };
  }
}

function saveSettings(settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

function addCourse(course) {
  const db = readDb();
  const exists = db.courses.find(c => c.path === course.path);
  if (!exists) {
    course.data = {}; 
    course.lastPlayedAt = new Date().toISOString();
    // Tambahkan displayName (default sama dengan title folder)
    course.displayName = course.title; 
    db.courses.push(course);
    writeDb(db);
  }
  return db.courses;
}

function getCourses() {
  const db = readDb();
  return db.courses.sort((a, b) => new Date(b.lastPlayedAt || 0) - new Date(a.lastPlayedAt || 0));
}

function updateVideoData(coursePath, videoId, key, value) {
  const db = readDb();
  const courseIndex = db.courses.findIndex(c => c.path === coursePath);
  
  if (courseIndex !== -1) {
    if (!db.courses[courseIndex].data) db.courses[courseIndex].data = {};
    if (!db.courses[courseIndex].data[videoId]) db.courses[courseIndex].data[videoId] = {};
    
    db.courses[courseIndex].data[videoId][key] = value;
    
    const totalVideos = db.courses[courseIndex].totalVideos;
    const watchedCount = Object.values(db.courses[courseIndex].data).filter(v => v.watched).length;
    db.courses[courseIndex].progress = Math.round((watchedCount / totalVideos) * 100);

    writeDb(db);
    return db.courses[courseIndex];
  }
  return null;
}

function updateLastPlayed(coursePath, videoId) {
  const db = readDb();
  const courseIndex = db.courses.findIndex(c => c.path === coursePath);
  if (courseIndex !== -1) {
    db.courses[courseIndex].lastPlayedVideoId = videoId;
    db.courses[courseIndex].lastPlayedAt = new Date().toISOString();
    writeDb(db);
    return db.courses[courseIndex];
  }
}

function addVideoAttachment(coursePath, videoId, fileObj) {
  const db = readDb();
  const courseIndex = db.courses.findIndex(c => c.path === coursePath);
  if (courseIndex !== -1) {
    if (!db.courses[courseIndex].data) db.courses[courseIndex].data = {};
    if (!db.courses[courseIndex].data[videoId]) db.courses[courseIndex].data[videoId] = {};
    const currentData = db.courses[courseIndex].data[videoId];
    if (!currentData.attachments) currentData.attachments = [];
    const exists = currentData.attachments.find(a => a.path === fileObj.path);
    if (!exists) {
      currentData.attachments.push(fileObj);
      writeDb(db);
    }
    return currentData.attachments;
  }
  return [];
}

function removeVideoAttachment(coursePath, videoId, filePath) {
  const db = readDb();
  const courseIndex = db.courses.findIndex(c => c.path === coursePath);
  if (courseIndex !== -1 && db.courses[courseIndex].data?.[videoId]?.attachments) {
    const currentAttachments = db.courses[courseIndex].data[videoId].attachments;
    const newAttachments = currentAttachments.filter(a => a.path !== filePath);
    db.courses[courseIndex].data[videoId].attachments = newAttachments;
    writeDb(db);
    return newAttachments;
  }
  return [];
}

function getVideoData(coursePath, videoId) {
  const db = readDb();
  const course = db.courses.find(c => c.path === coursePath);
  if (course && course.data && course.data[videoId]) {
    return course.data[videoId];
  }
  return { watched: false, note: '', attachments: [] };
}

function resetDatabase() {
  const initialData = { courses: [] };
  writeDb(initialData);
  return [];
}

function deleteCourse(courseId) {
  const db = readDb();
  const filteredCourses = db.courses.filter(c => c.id !== courseId);
  
  if (db.courses.length !== filteredCourses.length) {
    db.courses = filteredCourses;
    writeDb(db);
    return true;
  }
  return false;
}

// FUNGSI BARU: Ganti Nama Kursus
function renameCourse(courseId, newName) {
  const db = readDb();
  const course = db.courses.find(c => c.id === courseId);
  if (course) {
    course.displayName = newName; // Simpan nama tampilan baru
    writeDb(db);
    return true;
  }
  return false;
}

module.exports = { 
  addCourse, getCourses, updateVideoData, getVideoData, 
  addVideoAttachment, removeVideoAttachment, updateLastPlayed, 
  resetDatabase, getSettings, saveSettings,
  deleteCourse, renameCourse // Export fungsi baru
};