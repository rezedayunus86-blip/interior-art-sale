-- Создание таблицы администраторов
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы работ (картин)
CREATE TABLE IF NOT EXISTS artworks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    size VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка тестового администратора (пароль: admin123)
INSERT INTO admins (email, password_hash, name) 
VALUES ('admin@artgallery.com', '$2a$10$YQ7P3qH0xqK5Z8Z5Z8Z5ZeK5Z8Z5Z8Z5Z8Z5Z8Z5Z8Z5Z8Z5Z8Z5Z', 'Администратор')
ON CONFLICT (email) DO NOTHING;

-- Вставка существующих работ в БД
INSERT INTO artworks (id, title, description, price, size, image_url) VALUES
(1, 'Фрагменты', 'Абстрактное произведение с геометрическими формами в черно-белой гамме. Динамичная композиция символизирует взаимодействие различных элементов и идей', 25000, '60x80 см', 'https://cdn.poehali.dev/files/6c543c82-ec8a-4fe3-a862-fb512b1f8793.jpg'),
(2, 'Земля и песок', 'Теплая абстракция в терракотовых тонах', 16000, '60x80 см', '/img/9b37b688-e631-4dd5-ad59-babfa4bf7431.jpg'),
(3, 'Нежность утра', 'Пастельная композиция в розово-кремовых оттенках', 14000, '50x70 см', '/img/9df82178-702a-4a4f-a7e9-61406a27ce93.jpg'),
(4, 'Морской бриз', 'Спокойная абстракция в сине-белых тонах', 18000, '70x90 см', '/img/8e767619-f079-49ee-b5b0-b135543d2aec.jpg'),
(5, 'Гармония форм', 'Абстрактная композиция в теплых тонах', 15000, '60x80 см', '/img/ada19162-1801-4583-88bc-753362c45292.jpg'),
(6, 'Потоки света', 'Минималистичная работа в пастельных оттенках', 12000, '50x70 см', '/img/994681b9-75b3-4922-9e23-f5bf0850b377.jpg')
ON CONFLICT (id) DO NOTHING;