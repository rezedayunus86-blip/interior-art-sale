import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';

interface News {
  id: number;
  title: string;
  excerpt: string;
  image?: string;
  published_at: string;
  created_at: string;
}

const NewsList: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/news`);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту новость?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setNews(news.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  if (loading) {
    return <div className="p-8">Загрузка...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Новости</h1>
        <Link to="/admin/news/new">
          <Button>
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить новость
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Изображение</TableHead>
                <TableHead>Заголовок</TableHead>
                <TableHead>Краткое описание</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.published_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.excerpt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/admin/news/${item.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Icon name="Edit" size={16} />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(item.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {news.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Новостей пока нет
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsList;