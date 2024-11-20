import fs from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif'
};

export async function serveStatic(req, res, path) {
  try {
    const filePath = join(__dirname, '..', path);
    const content = await fs.readFile(filePath);
    const ext = path.split('.').pop();
    
    res.writeHead(200, { 'Content-Type': mimeTypes['.' + ext] || 'text/plain' });
    res.end(content);
  } catch (error) {
    res.writeHead(404);
    res.end('File not found');
  }
}