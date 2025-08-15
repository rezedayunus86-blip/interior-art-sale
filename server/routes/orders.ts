import { Router } from 'express';
import { getDb } from '../db/init.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const orders = await db.all(`
      SELECT o.*, a.title as artwork_title, a.image as artwork_image
      FROM orders o
      JOIN artworks a ON o.artwork_id = a.id
      ORDER BY o.created_at DESC
    `);
    
    res.json(orders);
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    
    const order = await db.get(`
      SELECT o.*, a.title as artwork_title, a.image as artwork_image, a.price as artwork_price
      FROM orders o
      JOIN artworks a ON o.artwork_id = a.id
      WHERE o.id = ?
    `, [id]);
    
    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Ошибка при получении заказа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await getDb();
    const { 
      artwork_id, 
      customer_name, 
      customer_email, 
      customer_phone, 
      delivery_address, 
      total_amount 
    } = req.body;
    
    const artwork = await db.get('SELECT * FROM artworks WHERE id = ? AND status = "available"', [artwork_id]);
    
    if (!artwork) {
      return res.status(400).json({ error: 'Картина недоступна для заказа' });
    }
    
    const result = await db.run(
      `INSERT INTO orders (artwork_id, customer_name, customer_email, customer_phone, delivery_address, total_amount) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [artwork_id, customer_name, customer_email, customer_phone, delivery_address, total_amount]
    );
    
    await db.run('UPDATE artworks SET status = "sold" WHERE id = ?', [artwork_id]);
    
    res.status(201).json({ 
      id: result.lastID, 
      message: 'Заказ успешно создан',
      order_number: `ORD-${result.lastID.toString().padStart(6, '0')}`
    });
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { status, payment_id } = req.body;
    
    const updateQuery = payment_id 
      ? 'UPDATE orders SET status = ?, payment_id = ? WHERE id = ?'
      : 'UPDATE orders SET status = ? WHERE id = ?';
    
    const params = payment_id ? [status, payment_id, id] : [status, id];
    
    await db.run(updateQuery, params);
    
    res.json({ message: 'Статус заказа обновлен' });
  } catch (error) {
    console.error('Ошибка при обновлении статуса заказа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/payment-callback', async (req, res) => {
  try {
    const db = await getDb();
    const { orderId, paymentId, status } = req.body;
    
    if (status === 'SUCCESS') {
      await db.run(
        'UPDATE orders SET status = "paid", payment_id = ? WHERE id = ?',
        [paymentId, orderId]
      );
    } else {
      await db.run(
        'UPDATE orders SET status = "payment_failed" WHERE id = ?',
        [orderId]
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обработке callback платежа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;