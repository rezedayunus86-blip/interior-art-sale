import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface NewsFormData {
  title: string;
  content: string;
  excerpt: string;
  image: string;
  published_at: string;
}

const NewsForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    published_at: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchNews();
    }
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/news/${id}`);
      const data = await response.json();
      setFormData({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        image: data.image || '',
        published_at: data.published_at.split('T')[0],
      });
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/news/${id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/news`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          published_at: new Date(formData.published_at).toISOString(),
        }),
      });

      if (response.ok) {
        navigate('/admin/news');
      }
    } catch (error) {
      console.error('Error saving news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageGenerate = async () => {
    try {
      const prompt = `Новостное изображение для статьи "${formData.title}", художественная галерея, современное искусство`;
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      if (response.ok) {
        const { imageUrl } = await response.json();
        setFormData({ ...formData, image: imageUrl });
      }
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {isEdit ? 'Редактировать новость' : 'Добавить новость'}
        </h1>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Краткое описание</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Полный текст</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Изображение</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="URL изображения"
                  />
                  <Button type="button" variant="outline" onClick={handleImageGenerate}>
                    <Icon name="Sparkles" size={20} className="mr-2" />
                    Сгенерировать
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="published_at">Дата публикации</Label>
                <Input
                  id="published_at"
                  type="date"
                  value={formData.published_at}
                  onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/admin/news')}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewsForm;