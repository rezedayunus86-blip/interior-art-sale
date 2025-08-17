import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface DashboardStats {
  artworks: number;
  orders: number;
  news: number;
  contacts: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    artworks: 0,
    orders: 0,
    news: 0,
    contacts: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { title: 'Картины', value: stats.artworks, icon: 'Palette', color: 'text-blue-600' },
    { title: 'Заказы', value: stats.orders, icon: 'ShoppingCart', color: 'text-green-600' },
    { title: 'Новости', value: stats.news, icon: 'Newspaper', color: 'text-purple-600' },
    { title: 'Контакты', value: stats.contacts, icon: 'Phone', color: 'text-orange-600' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Панель управления</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon name={card.icon} size={24} className={card.color} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Здесь будут отображаться последние заказы</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/artworks/new" className="flex items-center p-3 rounded hover:bg-gray-100">
              <Icon name="Plus" size={20} className="mr-3 text-blue-600" />
              <span>Добавить картину</span>
            </a>
            <a href="/admin/news/new" className="flex items-center p-3 rounded hover:bg-gray-100">
              <Icon name="Plus" size={20} className="mr-3 text-purple-600" />
              <span>Создать новость</span>
            </a>
            <a href="/admin/orders" className="flex items-center p-3 rounded hover:bg-gray-100">
              <Icon name="List" size={20} className="mr-3 text-green-600" />
              <span>Просмотреть заказы</span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;