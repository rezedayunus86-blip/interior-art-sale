-- Добавление колонки для дополнительных изображений в галерею
ALTER TABLE artworks 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';
