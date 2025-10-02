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
  is_available: boolean;
  image_url: string;
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
    is_available: true,
    image_url: '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchArtwork();
    }
  }, [id]);

  const fetchArtwork = async () => {
    try {
      const response = await fetch(`https://functions.poehali.dev/5392aa02-a2d7-442d-85da-0c08ab524b9f?id=${id}`);
      const data = await response.json();
      setFormData({
        title: data.title,
        description: data.description,
        price: data.price.toString(),
        size: data.size,
        is_available: data.is_available,
        image_url: data.image_url,
      });
    } catch (error) {
      console.error('Error fetching artwork:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const response = await fetch('https://functions.poehali.dev/d53dbc1a-da88-4b73-a74e-c3e8dd545017', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64String,
            filename: file.name,
          }),
        });

        if (response.ok) {
          const { url } = await response.json();
          setFormData({ ...formData, image_url: url });
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch('https://functions.poehali.dev/5392aa02-a2d7-442d-85da-0c08ab524b9f', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || '',
        },
        body: JSON.stringify({
          ...(isEdit ? { id: parseInt(id!) } : {}),
          title: formData.title,
          description: formData.description,
          price: parseInt(formData.price),
          size: formData.size,
          image_url: formData.image_url,
          is_available: formData.is_available,
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



  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {isEdit ? 'Редактировать картину' : 'Добавить картину'}
        </h1>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
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
              </div>

              <div>
                <Label htmlFor="image_url">Изображение</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="URL изображения"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="max-w-xs"
                    />
                    {uploading && (
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Загрузка...
                      </span>
                    )}
                  </div>
                  {formData.image_url && (
                    <div className="mt-2">
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>



              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked as boolean })}
                />
                <Label htmlFor="is_available">В наличии</Label>
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