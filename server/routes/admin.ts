import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const db = new Database('artgallery.db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@artgallery.com';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/verify', authMiddleware, (req, res) => {
  res.json({ valid: true });
});

router.get('/stats', authMiddleware, (req, res) => {
  try {
    const artworks = db.prepare('SELECT COUNT(*) as count FROM artworks').get();
    const orders = db.prepare('SELECT COUNT(*) as count FROM orders').get();
    const news = db.prepare('SELECT COUNT(*) as count FROM news').get();
    const contacts = db.prepare('SELECT COUNT(*) as count FROM contacts').get();

    res.json({
      artworks: artworks?.count || 0,
      orders: orders?.count || 0,
      news: news?.count || 0,
      contacts: contacts?.count || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения статистики' });
  }
});

export default router;