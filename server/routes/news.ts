import { Router } from 'express';
import Database from 'better-sqlite3';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const db = new Database('artgallery.db');

// Получить все новости
router.get('/', (req, res) => {
  try {
    const news = db.prepare('SELECT * FROM news ORDER BY published_at DESC').all();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения новостей' });
  }
});

// Получить новость по ID
router.get('/:id', (req, res) => {
  try {
    const news = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'Новость не найдена' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения новости' });
  }
});

// Создать новость (только для админа)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, content, excerpt, image, published_at } = req.body;
    
    const result = db.prepare(`
      INSERT INTO news (title, content, excerpt, image, published_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(title, content, excerpt, image, published_at || new Date().toISOString());

    res.json({ id: result.lastInsertRowid, message: 'Новость создана' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания новости' });
  }
});

// Обновить новость (только для админа)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { title, content, excerpt, image, published_at } = req.body;
    
    const result = db.prepare(`
      UPDATE news 
      SET title = ?, content = ?, excerpt = ?, image = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, content, excerpt, image, published_at, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Новость не найдена' });
    }

    res.json({ message: 'Новость обновлена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления новости' });
  }
});

// Удалить новость (только для админа)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Новость не найдена' });
    }

    res.json({ message: 'Новость удалена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления новости' });
  }
});

export default router;