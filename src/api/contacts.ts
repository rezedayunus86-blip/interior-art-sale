const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Contact {
  name: string;
  phone: string;
  message?: string;
  artwork_title?: string;
}

export interface ContactResponse {
  id: number;
  message: string;
}

export const contactsApi = {
  async create(contact: Contact): Promise<ContactResponse> {
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit contact form');
    }
    return response.json();
  },
};