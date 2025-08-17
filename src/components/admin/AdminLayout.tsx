import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', name: 'Главная', icon: 'LayoutDashboard' },
    { path: '/admin/artworks', name: 'Картины', icon: 'Palette' },
    { path: '/admin/news', name: 'Новости', icon: 'Newspaper' },
    { path: '/admin/orders', name: 'Заказы', icon: 'ShoppingCart' },
    { path: '/admin/contacts', name: 'Контакты', icon: 'Phone' },
    { path: '/admin/settings', name: 'Настройки', icon: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Админ панель</h2>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                location.pathname === item.path ? 'bg-gray-100 border-l-4 border-primary' : ''
              }`}
            >
              <Icon name={item.icon} size={20} className="mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <Icon name="LogOut" size={20} className="mr-2" />
            Выйти
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;