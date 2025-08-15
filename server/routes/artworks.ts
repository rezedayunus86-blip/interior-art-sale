import { Router } from 'express';
import { getDb } from '../db/init.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const artworks = await db.all(`
      SELECT a.*, 
        (SELECT url FROM artwork_images WHERE artwork_id = a.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM artworks a
      WHERE a.status = 'available'
      ORDER BY a.created_at DESC
    `);
    
    res.json(artworks);
  } catch (error) {
    console.error('Ошибка при получении картин:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    
    const artwork = await db.get(
      'SELECT * FROM artworks WHERE id = ? AND status = "available"',
      [id]
    );
    
    if (!artwork) {
      return res.status(404).json({ error: 'Картина не найдена' });
    }
    
    const images = await db.all(
      'SELECT url, title FROM artwork_images WHERE artwork_id = ? ORDER BY sort_order',
      [id]
    );
    
    res.json({ ...artwork, images });
  } catch (error) {
    console.error('Ошибка при получении картины:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await getDb();
    const { title, description, full_description, price, size, technique, year, image, images } = req.body;
    
    const result = await db.run(
      `INSERT INTO artworks (title, description, full_description, price, size, technique, year, image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, full_description, price, size, technique, year, image]
    );
    
    const artworkId = result.lastID;
    
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await db.run(
          `INSERT INTO artwork_images (artwork_id, url, title, is_primary, sort_order) 
           VALUES (?, ?, ?, ?, ?)`,
          [artworkId, img.url, img.title, i === 0 ? 1 : 0, i]
        );
      }
    }
    
    res.status(201).json({ id: artworkId, message: 'Картина успешно добавлена' });
  } catch (error) {
    console.error('Ошибка при создании картины:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { title, description, full_description, price, size, technique, year, status } = req.body;
    
    await db.run(
      `UPDATE artworks 
       SET title = ?, description = ?, full_description = ?, price = ?, 
           size = ?, technique = ?, year = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, full_description, price, size, technique, year, status, id]
    );
    
    res.json({ message: 'Картина успешно обновлена' });
  } catch (error) {
    console.error('Ошибка при обновлении картины:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    
    await db.run('UPDATE artworks SET status = "deleted" WHERE id = ?', [id]);
    
    res.json({ message: 'Картина успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении картины:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;