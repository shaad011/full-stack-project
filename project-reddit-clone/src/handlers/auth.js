import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { createSession, getSession } from '../utils/session.js';

export async function handleAuth(req, res, path, body) {
  if (path === '/auth/register' && req.method === 'POST') {
    const { username, password } = JSON.parse(body);
    
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      db.prepare('INSERT INTO users (username, password) VALUES (?, ?)')
        .run(username, hashedPassword);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Username already exists' }));
    }
  }
  
  else if (path === '/auth/login' && req.method === 'POST') {
    const { username, password } = JSON.parse(body);
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    
    if (user && bcrypt.compareSync(password, user.password)) {
      const sessionId = createSession(user);
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': `sessionId=${sessionId}; HttpOnly; Path=/`
      });
      res.end(JSON.stringify({ success: true }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid credentials' }));
    }
  }
  
  else if (path === '/auth/logout' && req.method === 'POST') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': 'sessionId=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    });
    res.end(JSON.stringify({ success: true }));
  }
}