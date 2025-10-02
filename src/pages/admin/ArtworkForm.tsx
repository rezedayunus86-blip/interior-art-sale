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
  gallery_images: string[];
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
    gallery_images: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState<number | null>(null);
  const [galleryDragging, setGalleryDragging] = useState(false);

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
        gallery_images: data.gallery_images || [],
      });
    } catch (error) {
      console.error('Error fetching artwork:', error);
    }
  };

  const uploadFile = async (file: File) => {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadFile(file);
    }
  };

  const uploadGalleryFile = async (file: File, index?: number) => {
    setGalleryUploading(index ?? -1);
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
          const newGalleryImages = [...formData.gallery_images];
          if (index !== undefined) {
            newGalleryImages[index] = url;
          } else {
            newGalleryImages.push(url);
          }
          setFormData({ ...formData, gallery_images: newGalleryImages });
        }
        setGalleryUploading(null);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading gallery image:', error);
      setGalleryUploading(null);
    }
  };

  const handleGalleryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setGalleryDragging(true);
  };

  const handleGalleryDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setGalleryDragging(false);
  };

  const handleGalleryDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setGalleryDragging(false);

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await uploadGalleryFile(file);
      }
    }
  };

  const handleGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      await uploadGalleryFile(files[i]);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGalleryImages = formData.gallery_images.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery_images: newGalleryImages });
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
          gallery_images: formData.gallery_images,
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
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragging 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center justify-center py-4">
                        <Icon name="Loader2" size={40} className="text-primary animate-spin mb-3" />
                        <p className="text-sm text-muted-foreground">Загрузка изображения...</p>
                      </div>
                    ) : formData.image_url ? (
                      <div className="space-y-3">
                        <img 
                          src={formData.image_url} 
                          alt="Preview" 
                          className="w-48 h-48 object-cover rounded mx-auto border"
                        />
                        <p className="text-sm text-muted-foreground">Перетащите новое изображение для замены</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <Icon name="Upload" size={40} className="text-muted-foreground mb-3" />
                        <p className="text-base font-medium mb-1">
                          Перетащите изображение сюда
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          или нажмите для выбора файла
                        </p>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" asChild>
                            <span>
                              <Icon name="Image" size={20} className="mr-2" />
                              Выбрать файл
                            </span>
                          </Button>
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="image_url" className="text-xs text-muted-foreground">
                      Или вставьте URL изображения
                    </Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Дополнительные изображения (Галерея)</Label>
                <div className="space-y-3">
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      galleryDragging 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleGalleryDragOver}
                    onDragLeave={handleGalleryDragLeave}
                    onDrop={handleGalleryDrop}
                  >
                    <div className="flex flex-col items-center justify-center py-3">
                      <Icon name="Images" size={32} className="text-muted-foreground mb-2" />
                      <p className="text-sm font-medium mb-1">
                        Перетащите изображения для галереи
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        или нажмите для выбора нескольких файлов
                      </p>
                      <label htmlFor="gallery-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>
                            <Icon name="Plus" size={16} className="mr-2" />
                            Добавить изображения
                          </span>
                        </Button>
                      </label>
                      <input
                        id="gallery-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {formData.gallery_images.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {formData.gallery_images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={img} 
                            alt={`Gallery ${index + 1}`} 
                            className="w-full h-32 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Icon name="X" size={16} />
                          </button>
                          {galleryUploading === index && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                              <Icon name="Loader2" size={24} className="text-white animate-spin" />
                            </div>
                          )}
                        </div>
                      ))}
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