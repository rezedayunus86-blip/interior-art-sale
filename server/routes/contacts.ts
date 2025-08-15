import { Router } from 'express';
import { getDb } from '../db/init.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const contacts = await db.all(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    );
    
    res.json(contacts);
  } catch (error) {
    console.error('Ошибка при получении контактов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await getDb();
    const { name, phone, message, artwork_title } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Имя и телефон обязательны' });
    }
    
    const result = await db.run(
      `INSERT INTO contacts (name, phone, message, artwork_title) 
       VALUES (?, ?, ?, ?)`,
      [name, phone, message || null, artwork_title || null]
    );
    
    res.status(201).json({ 
      id: result.lastID, 
      message: 'Контактная форма успешно отправлена' 
    });
  } catch (error) {
    console.error('Ошибка при создании контакта:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    
    await db.run('DELETE FROM contacts WHERE id = ?', [id]);
    
    res.json({ message: 'Контакт успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении контакта:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;