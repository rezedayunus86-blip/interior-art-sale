import Database from 'better-sqlite3';
import { initArtworksTable } from './artworks';
import { initOrdersTable } from './orders';
import { initContactsTable } from './contacts';
import { initNewsTable } from './news';

export function initDatabase() {
  const db = new Database('artgallery.db');
  
  initArtworksTable(db);
  initOrdersTable(db);
  initContactsTable(db);
  initNewsTable(db);
  
  return db;
}