import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
interface Artwork {
  id: number;
  title: string;
  description: string;
  price: number;
  size: string;
  image_url: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

const ArtworksList: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/5392aa02-a2d7-442d-85da-0c08ab524b9f');
      const data = await response.json();
      setArtworks(data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту картину?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://functions.poehali.dev/5392aa02-a2d7-442d-85da-0c08ab524b9f?id=${id}`, {
        method: 'DELETE',
        headers: { 'X-Auth-Token': token || '' },
      });

      if (response.ok) {
        setArtworks(artworks.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Error deleting artwork:', error);
    }
  };

  if (loading) {
    return <div className="p-8">Загрузка...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Картины</h1>
        <Link to="/admin/artworks/new">
          <Button>
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить картину
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Изображение</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Размер</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artworks.map((artwork) => (
                <TableRow key={artwork.id}>
                  <TableCell>
                    <img 
                      src={artwork.image_url} 
                      alt={artwork.title} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{artwork.title}</TableCell>
                  <TableCell>{artwork.price.toLocaleString()} ₽</TableCell>
                  <TableCell>{artwork.size}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded ${
                      artwork.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {artwork.is_available ? 'В наличии' : 'Продано'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/admin/artworks/${artwork.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Icon name="Edit" size={16} />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(artwork.id!)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtworksList;