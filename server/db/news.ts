import Database from 'better-sqlite3';

export interface News {
  id?: number;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  published_at: string;
  created_at?: string;
  updated_at?: string;
}

export function initNewsTable(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      image TEXT,
      published_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Добавляем пример новостей
  const newsCount = db.prepare('SELECT COUNT(*) as count FROM news').get() as { count: number };
  
  if (newsCount.count === 0) {
    const sampleNews = [
      {
        title: 'Открытие новой выставки "Грани абстракции"',
        content: 'Рады сообщить об открытии новой выставки современного искусства. В экспозиции представлены работы молодых художников, исследующих границы абстрактного искусства.',
        excerpt: 'Новая выставка современного искусства откроется в нашей галерее',
        image: '/img/news1.jpg',
        published_at: new Date().toISOString(),
      },
      {
        title: 'Мастер-класс по живописи маслом',
        content: 'Приглашаем всех желающих на мастер-класс по живописи маслом. Занятие проведет известный художник. Все материалы предоставляются.',
        excerpt: 'Научитесь основам живописи маслом с профессиональным художником',
        image: '/img/news2.jpg',
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const insert = db.prepare(`
      INSERT INTO news (title, content, excerpt, image, published_at)
      VALUES (@title, @content, @excerpt, @image, @published_at)
    `);

    for (const news of sampleNews) {
      insert.run(news);
    }
  }
}