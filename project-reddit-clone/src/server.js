import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { initDb } from './config/database.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Pass user to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Home page
app.get('/', async (req, res) => {
  try {
    const [posts] = await pool.execute(`
      SELECT p.*, u.username, 
        COALESCE(SUM(v.value), 0) as votes,
        COUNT(DISTINCT c.id) as comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN votes v ON p.id = v.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    
    res.render('index', { posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).render('error', { message: 'Error fetching posts' });
  }
});

// Initialize database and start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();