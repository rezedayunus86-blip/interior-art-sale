import Database from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initDatabase() {
  const db = await open({
    filename: path.join(__dirname, 'artgallery.db'),
    driver: Database.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS artworks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      full_description TEXT,
      price TEXT NOT NULL,
      size TEXT,
      technique TEXT,
      year TEXT,
      image TEXT NOT NULL,
      status TEXT DEFAULT 'available',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS artwork_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      artwork_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      title TEXT,
      is_primary BOOLEAN DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      artwork_id INTEGER NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      total_amount TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (artwork_id) REFERENCES artworks(id)
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT,
      artwork_title TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const count = await db.get('SELECT COUNT(*) as count FROM artworks');
  
  if (count.count === 0) {
    console.log('Заполняю базу данных начальными данными...');
    await seedDatabase(db);
  }

  return db;
}

async function seedDatabase(db: any) {
  const artworks = [
    {
      title: 'Закат над городом',
      description: 'Абстрактная композиция в теплых тонах',
      full_description: 'Эта работа передает атмосферу городского заката через абстрактные формы и насыщенные цвета. Картина наполнена энергией и динамикой современного мегаполиса.',
      price: '25 000 ₽',
      size: '80x100 см',
      technique: 'Акрил на холсте',
      year: '2024',
      image: 'https://cdn.poehali.dev/files/6c543c82-ec8a-4fe3-a862-fb512b1f8793.jpg'
    },
    {
      title: 'Земля и песок',
      description: 'Теплая абстракция в терракотовых тонах',
      full_description: 'Работа выполнена в теплых земляных тонах, создавая ощущение природной гармонии и уюта. Идеально подходит для современных интерьеров.',
      price: '16 000 ₽',
      size: '60x80 см',
      technique: 'Акрил на холсте',
      year: '2024',
      image: '/img/9b37b688-e631-4dd5-ad59-babfa4bf7431.jpg'
    }
  ];

  for (const artwork of artworks) {
    const result = await db.run(
      `INSERT INTO artworks (title, description, full_description, price, size, technique, year, image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [artwork.title, artwork.description, artwork.full_description, artwork.price, 
       artwork.size, artwork.technique, artwork.year, artwork.image]
    );

    const artworkId = result.lastID;

    const images = [
      { url: artwork.image, title: 'Общий вид', is_primary: 1, sort_order: 0 },
      { url: '/img/e47fe32a-723c-4997-8ee0-606e76e0b662.jpg', title: 'В интерьере', is_primary: 0, sort_order: 2 }
    ];

    if (artwork.title === 'Земля и песок') {
      images.splice(1, 0, { url: '/img/b0aa6be1-68e6-4a3a-b699-684febcc9ce1.jpg', title: 'Фрагмент крупным планом', is_primary: 0, sort_order: 1 });
    } else {
      images.splice(1, 0, { url: '/img/5ab628e4-c8df-45bd-8d93-c66268b3d6e3.jpg', title: 'Фрагмент крупным планом', is_primary: 0, sort_order: 1 });
    }

    for (const img of images) {
      await db.run(
        `INSERT INTO artwork_images (artwork_id, url, title, is_primary, sort_order) 
         VALUES (?, ?, ?, ?, ?)`,
        [artworkId, img.url, img.title, img.is_primary, img.sort_order]
      );
    }
  }
}

export async function getDb() {
  return await open({
    filename: path.join(__dirname, 'artgallery.db'),
    driver: Database.Database
  });
}