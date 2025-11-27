// electron/utils.js
const fs = require('fs');
const path = require('path');

const VIDEO_EXT = ['.mp4', '.mkv', '.webm', '.avi', '.mov', '.m4v'];
const SUB_EXT = ['.srt', '.vtt', '.ass'];
// File apa saja yang dianggap sebagai "Resource/Attachment"
const RESOURCE_EXT = ['.pdf', '.zip', '.rar', '.7z', '.png', '.jpg', '.jpeg', '.txt', '.md', '.pptx', '.docx', '.xlsx'];

function scanDirectory(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    
    const videos = [];
    const resources = []; // Array baru untuk menyimpan file pendukung
    const subtitles = {};

    files.forEach(file => {
      // Abaikan file system/hidden
      if (file.startsWith('.')) return;

      const ext = path.extname(file).toLowerCase();
      const name = path.basename(file, ext);
      const fullPath = path.join(dirPath, file);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) return; // Skip folder dalam folder (untuk saat ini)

      if (VIDEO_EXT.includes(ext)) {
        videos.push({
          id: name,
          name: file,
          path: fullPath,
          baseName: name,
          size: stats.size
        });
      } else if (SUB_EXT.includes(ext)) {
        subtitles[name] = fullPath;
      } else if (RESOURCE_EXT.includes(ext)) {
        // Masukkan ke list resources
        resources.push({
          name: file,
          path: fullPath,
          type: ext.replace('.', '').toUpperCase(), // PDF, ZIP, etc
          size: (stats.size / 1024 / 1024).toFixed(2) + ' MB' // Konversi ke MB
        });
      }
    });

    // Sort Video (Video 1, Video 2...)
    const sortedVideos = videos.sort((a, b) => {
      return a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base'
      });
    });

    // Gabungkan subtitle ke video
    const finalVideos = sortedVideos.map((video, index) => ({
      ...video,
      order: index + 1,
      subtitle: subtitles[video.baseName] || null
    }));

    // Kembalikan objek lengkap
    return { 
      videos: finalVideos, 
      resources: resources 
    };

  } catch (error) {
    console.error(error);
    return { videos: [], resources: [] };
  }
}

module.exports = { scanDirectory };