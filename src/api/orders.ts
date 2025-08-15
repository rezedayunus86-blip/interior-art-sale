const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Order {
  id?: number;
  artwork_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  total_amount: string;
  status?: string;
  payment_id?: string;
  created_at?: string;
}

export interface OrderResponse {
  id: number;
  message: string;
  order_number: string;
}

export const ordersApi = {
  async create(order: Order): Promise<OrderResponse> {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }
    return response.json();
  },

  async getById(id: string | number): Promise<Order & { artwork_title: string; artwork_image: string }> {
    const response = await fetch(`${API_URL}/orders/${id}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  async updateStatus(id: string | number, status: string, payment_id?: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, payment_id }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },
};