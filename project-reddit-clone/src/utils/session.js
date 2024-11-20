import crypto from 'crypto';

const sessions = new Map();

export function createSession(user) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  sessions.set(sessionId, {
    userId: user.id,
    username: user.username
  });
  return sessionId;
}

export function getSession(req) {
  const cookies = req.headers.cookie?.split(';')
    .map(cookie => cookie.trim().split('='))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  
  return sessions.get(cookies?.sessionId);
}

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.created > 24 * 60 * 60 * 1000) { // 24 hours
      sessions.delete(sessionId);
    }
  }
}, 60 * 60 * 1000); // Every hour