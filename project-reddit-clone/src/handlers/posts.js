import { db } from '../db.js';
import { getSession } from '../utils/session.js';

export async function handlePosts(req, res, path, body) {
  const session = getSession(req);
  
  if (!session) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }

  if (path === '/posts/create' && req.method === 'POST') {
    const { title, content } = JSON.parse(body);
    
    db.prepare('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)')
      .run(title, content, session.userId);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
  }
  
  else if (path.startsWith('/posts/vote/') && req.method === 'POST') {
    const postId = parseInt(path.split('/').pop());
    const { value } = JSON.parse(body);
    
    db.prepare(`
      INSERT INTO votes (post_id, user_id, value)
      VALUES (?, ?, ?)
      ON CONFLICT(post_id, user_id) DO UPDATE SET value = ?
    `).run(postId, session.userId, value, value);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
  }
}