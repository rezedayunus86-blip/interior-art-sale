import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artworkTitle?: string;
}

export default function ContactModal({ open, onOpenChange, artworkTitle }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Формируем сообщение для WhatsApp
    const whatsappMessage = `Здравствуйте! Меня интересует ${artworkTitle ? `картина "${artworkTitle}"` : 'ваша работа'}.\n\nИмя: ${formData.name}\nТелефон: ${formData.phone}\nEmail: ${formData.email}\n\nВопрос: ${formData.message}`;
    
    // Открываем WhatsApp с предзаполненным сообщением
    const whatsappUrl = `https://wa.me/79033183322?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    toast.success("Перенаправляем вас в WhatsApp...");
    
    // Закрываем модальное окно
    setTimeout(() => {
      onOpenChange(false);
      // Очищаем форму
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: ""
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Задать вопрос художнику</DialogTitle>
          <DialogDescription className="font-body">
            {artworkTitle ? `По картине "${artworkTitle}"` : 'Заполните форму, и я свяжусь с вами'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-body">Ваше имя</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Как к вам обращаться?"
              required
              className="font-body"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-body">Телефон</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+7 (___) ___-__-__"
              required
              className="font-body"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="font-body">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className="font-body"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="font-body">Ваш вопрос</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Напишите ваш вопрос или пожелание..."
              rows={4}
              required
              className="font-body"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-body"
            >
              <Icon name="Send" size={16} className="mr-2" />
              Отправить в WhatsApp
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-body"
            >
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}