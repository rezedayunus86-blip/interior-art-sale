import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

interface ArtworkFormData {
  title: string;
  description: string;
  price: string;
  size: string;
  technique: string;
  year: string;
  available: boolean;
  image: string;
  additionalImages: string[];
}

const ArtworkForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState<ArtworkFormData>({
    title: '',
    description: '',
    price: '',
    size: '',
    technique: '',
    year: '',
    available: true,
    image: '',
    additionalImages: ['', '', ''],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchArtwork();
    }
  }, [id]);

  const fetchArtwork = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/artworks/${id}`);
      const data = await response.json();
      setFormData({
        title: data.title,
        description: data.description,
        price: data.price.toString(),
        size: data.size,
        technique: data.technique,
        year: data.year.toString(),
        available: data.available,
        image: data.image,
        additionalImages: data.additionalImages || ['', '', ''],
      });
    } catch (error) {
      console.error('Error fetching artwork:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/artworks/${id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/artworks`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          year: parseInt(formData.year),
          additionalImages: formData.additionalImages.filter(img => img !== ''),
        }),
      });

      if (response.ok) {
        navigate('/admin/artworks');
      }
    } catch (error) {
      console.error('Error saving artwork:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageGenerate = async (index: number = -1) => {
    try {
      const prompt = `Абстрактная живопись в стиле ${formData.technique || 'современного искусства'}, ${formData.title || 'художественное произведение'}`;
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      if (response.ok) {
        const { imageUrl } = await response.json();
        if (index === -1) {
          setFormData({ ...formData, image: imageUrl });
        } else {
          const newImages = [...formData.additionalImages];
          newImages[index] = imageUrl;
          setFormData({ ...formData, additionalImages: newImages });
        }
      }
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {isEdit ? 'Редактировать картину' : 'Добавить картину'}
        </h1>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Название</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Цена (₽)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="size">Размер</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="50x70 см"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="technique">Техника</Label>
                  <Input
                    id="technique"
                    value={formData.technique}
                    onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
                    placeholder="Масло на холсте"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="year">Год</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Основное изображение</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="URL изображения"
                    required
                  />
                  <Button type="button" variant="outline" onClick={() => handleImageGenerate()}>
                    <Icon name="Sparkles" size={20} className="mr-2" />
                    Сгенерировать
                  </Button>
                </div>
              </div>

              <div>
                <Label>Дополнительные изображения</Label>
                {formData.additionalImages.map((img, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={img}
                      onChange={(e) => {
                        const newImages = [...formData.additionalImages];
                        newImages[index] = e.target.value;
                        setFormData({ ...formData, additionalImages: newImages });
                      }}
                      placeholder={`URL изображения ${index + 1}`}
                    />
                    <Button type="button" variant="outline" onClick={() => handleImageGenerate(index)}>
                      <Icon name="Sparkles" size={20} />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked as boolean })}
                />
                <Label htmlFor="available">В наличии</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/admin/artworks')}>
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

export default ArtworkForm;