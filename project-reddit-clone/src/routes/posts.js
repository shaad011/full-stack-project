import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// Middleware to check if user is logged in
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please login first' });
  }
  next();
};

router.post('/create', requireLogin, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.session.user.id;
    
    const [result] = await pool.execute(
      'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
      [title, content, userId]
    );
    
    res.json({ success: true, postId: result.insertId });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error creating post' });
  }
});

router.post('/vote/:postId', requireLogin, async (req, res) => {
  try {
    const { postId } = req.params;
    const { value } = req.body;
    const userId = req.session.user.id;
    
    await pool.execute(`
      INSERT INTO votes (post_id, user_id, value)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE value = ?
    `, [postId, userId, value, value]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ error: 'Error processing vote' });
  }
});

export default router;