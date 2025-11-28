// electron/handlers/protocol.js
const { protocol, net } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

function registerSchemes() {
  protocol.registerSchemesAsPrivileged([
    { scheme: 'lcp', privileges: { bypassCSP: true, stream: true, supportFetchAPI: true, secure: true } }
  ]);
}

function setupProtocolHandler() {
  protocol.handle('lcp', (request) => {
    try {
      const urlPath = request.url.replace('lcp://', '');
      const decodedPath = decodeURIComponent(urlPath);
      const normalizedPath = path.normalize(decodedPath);

      if (!fs.existsSync(normalizedPath)) {
        return new Response('File not found', { status: 404 });
      }

      const stat = fs.statSync(normalizedPath);
      
      // Prevent Directory read error
      if (!stat.isFile()) {
         return new Response('Not a file', { status: 400 });
      }

      const fileSize = stat.size;
      const range = request.headers.get('Range');

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        // Fix: Ensure end is not -1 for empty files, and clamp to fileSize - 1
        const end = parts[1] ? parseInt(parts[1], 10) : Math.max(fileSize - 1, start);
        
        // Fix: Check if range is valid
        if (start >= fileSize || start > end) {
           return new Response('', {
             status: 416,
             headers: { 'Content-Range': `bytes */${fileSize}` }
           });
        }

        const chunksize = (end - start) + 1;
        const stream = fs.createReadStream(normalizedPath, { start, end });

        const readable = new ReadableStream({
          start(controller) {
            stream.on('data', chunk => {
              try { controller.enqueue(chunk); } catch (e) { stream.destroy(); }
            });
            stream.on('end', () => {
              try { controller.close(); } catch (e) {}
            });
            stream.on('error', err => {
              try { controller.error(err); } catch (e) {}
            });
          },
          cancel() {
            stream.destroy();
          }
        });

        return new Response(readable, {
          status: 206,
          headers: {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
          }
        });
      } else {
        const stream = fs.createReadStream(normalizedPath);
        const readable = new ReadableStream({
          start(controller) {
            stream.on('data', chunk => {
              try { controller.enqueue(chunk); } catch (e) { stream.destroy(); }
            });
            stream.on('end', () => {
              try { controller.close(); } catch (e) {}
            });
            stream.on('error', err => {
              try { controller.error(err); } catch (e) {}
            });
          },
          cancel() {
            stream.destroy();
          }
        });

        return new Response(readable, {
          status: 200,
          headers: {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
          }
        });
      }
    } catch (error) {
      console.error('LCP Protocol Error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  });
}

module.exports = { registerSchemes, setupProtocolHandler };