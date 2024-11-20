import express from 'express';
import session from 'express-session';
import ConnectSqlite3 from 'connect-sqlite3';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { db, initDb } from './db.js';
import * as authRoutes from './routes/auth.js';
import * as postRoutes from './routes/posts.js';

const SQLiteStore = ConnectSqlite3(session);
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));
app.use(session({
  store: new SQLiteStore({
    db: 'sessions.db',
    dir: './data'
  }),
  secret: 'reddit-clone-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Pass user to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Routes
app.use(authRoutes.router);
app.use(postRoutes.router);

app.get('/', async (req, res) => {
  const posts = db.prepare('SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY created_at DESC').all();
  res.render('index', { posts });
});

// Initialize database and start server
initDb();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});