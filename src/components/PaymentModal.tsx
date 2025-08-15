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
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artwork: {
    title: string;
    price: string;
    id: number;
  };
}

export default function PaymentModal({ open, onOpenChange, artwork }: PaymentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Здесь будет интеграция с T-Bank API
    // Пока используем заглушку
    
    try {
      // Имитация создания платежа
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // В реальном приложении здесь будет:
      // 1. Создание заказа на бэкенде
      // 2. Получение платежной ссылки от T-Bank
      // 3. Редирект на страницу оплаты
      
      toast.success("Перенаправляем на страницу оплаты T-Bank...");
      
      // Временно показываем сообщение
      setTimeout(() => {
        toast.info("Для завершения интеграции с T-Bank свяжитесь с разработчиком");
        onOpenChange(false);
      }, 2000);
      
    } catch (error) {
      toast.error("Произошла ошибка. Попробуйте позже.");
    } finally {
      setIsProcessing(false);
    }
  };

  const priceNumber = parseInt(artwork.price.replace(/\D/g, ''));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Оформление покупки</DialogTitle>
          <DialogDescription className="font-body">
            Картина "{artwork.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gray-50 p-4 rounded-lg my-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-body text-muted-foreground">Стоимость картины:</span>
            <span className="font-body font-semibold">{artwork.price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body text-muted-foreground">Доставка по России:</span>
            <span className="font-body font-semibold">Бесплатно</span>
          </div>
          <div className="border-t mt-3 pt-3">
            <div className="flex justify-between items-center">
              <span className="font-body font-semibold">Итого к оплате:</span>
              <span className="font-display text-xl font-bold text-accent">{artwork.price}</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-body">ФИО получателя</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Иванов Иван Иванович"
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
              required
              className="font-body"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="font-body">Адрес доставки</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Город, улица, дом, квартира"
              required
              className="font-body"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Shield" size={16} className="text-green-600" />
            <span className="font-body">Безопасная оплата через T-Bank</span>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-body"
            >
              {isProcessing ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Обработка...
                </>
              ) : (
                <>
                  <Icon name="CreditCard" size={16} className="mr-2" />
                  Перейти к оплате
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
              className="font-body"
            >
              Отмена
            </Button>
          </div>
        </form>
        
        <div className="text-xs text-muted-foreground text-center pt-2">
          <p className="font-body">
            Нажимая "Перейти к оплате", вы соглашаетесь с условиями продажи
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}