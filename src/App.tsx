
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ArtworkDetail from "./pages/ArtworkDetail";
import NotFound from "./pages/NotFound";
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLogin from '@/pages/admin/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import ArtworksList from '@/pages/admin/ArtworksList';
import ArtworkForm from '@/pages/admin/ArtworkForm';
import OrdersList from '@/pages/admin/OrdersList';
import NewsList from '@/pages/admin/NewsList';
import NewsForm from '@/pages/admin/NewsForm';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="artworks" element={<ArtworksList />} />
            <Route path="artworks/new" element={<ArtworkForm />} />
            <Route path="artworks/:id/edit" element={<ArtworkForm />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="news" element={<NewsList />} />
            <Route path="news/new" element={<NewsForm />} />
            <Route path="news/:id/edit" element={<NewsForm />} />
            <Route index element={<AdminDashboard />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;