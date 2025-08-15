const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Artwork {
  id: number;
  title: string;
  description: string;
  full_description: string;
  price: string;
  size: string;
  technique: string;
  year: string;
  image: string;
  primary_image?: string;
  images?: Array<{
    url: string;
    title: string;
  }>;
  status: string;
  created_at: string;
  updated_at: string;
}

export const artworksApi = {
  async getAll(): Promise<Artwork[]> {
    const response = await fetch(`${API_URL}/artworks`);
    if (!response.ok) throw new Error('Failed to fetch artworks');
    return response.json();
  },

  async getById(id: string | number): Promise<Artwork> {
    const response = await fetch(`${API_URL}/artworks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch artwork');
    return response.json();
  },

  async create(artwork: Omit<Artwork, 'id' | 'created_at' | 'updated_at'>): Promise<{ id: number; message: string }> {
    const response = await fetch(`${API_URL}/artworks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(artwork),
    });
    if (!response.ok) throw new Error('Failed to create artwork');
    return response.json();
  },

  async update(id: string | number, artwork: Partial<Artwork>): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/artworks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(artwork),
    });
    if (!response.ok) throw new Error('Failed to update artwork');
    return response.json();
  },

  async delete(id: string | number): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/artworks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete artwork');
    return response.json();
  },
};