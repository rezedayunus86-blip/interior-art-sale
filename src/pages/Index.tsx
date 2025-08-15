import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

export default function Index() {
  const artworks = [
    {
      id: 1,
      title: "Гармония форм",
      description: "Абстрактная композиция в теплых тонах",
      price: "15 000 ₽",
      size: "60x80 см",
      image: "/img/ada19162-1801-4583-88bc-753362c45292.jpg"
    },
    {
      id: 2,
      title: "Потоки света",
      description: "Минималистичная работа в пастельных оттенках", 
      price: "12 000 ₽",
      size: "50x70 см",
      image: "/img/994681b9-75b3-4922-9e23-f5bf0850b377.jpg"
    },
    {
      id: 3,
      title: "Текстуры времени",
      description: "Современная интерпретация природных форм",
      price: "18 000 ₽",
      size: "70x90 см", 
      image: "/img/c1fc1aa8-f6f8-42e1-af13-ba1c4fcfa57b.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="font-display text-2xl font-bold text-primary">
              REZEDA YUNUS GALLERY
            </h1>
            <div className="flex items-center space-x-8">
              <a href="#gallery" className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Галерея
              </a>
              <a href="#about" className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                О художнике
              </a>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body">
                Связаться
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-5xl md:text-6xl font-bold text-primary mb-6 animate-fade-in">
              Интерьерные картины
              <span className="block text-accent">ручной работы</span>
            </h2>
            <p className="font-body text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in">
              Создаю уникальные произведения искусства, которые наполняют ваш дом особым настроением и атмосферой
            </p>
            <div className="flex justify-center space-x-4 animate-scale-in">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-body px-8">
                Посмотреть работы
              </Button>
              <Button variant="outline" size="lg" className="font-body px-8">
                <Icon name="Palette" size={20} className="mr-2" />
                Заказать картину
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="font-display text-4xl font-bold text-primary mb-4">
              Мои работы
            </h3>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Каждая картина создается с особой заботой о том, как она будет смотреться в вашем интерьере
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {artworks.map((artwork, index) => (
              <Card 
                key={artwork.id} 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="aspect-[4/5] overflow-hidden rounded-t-lg">
                  <img 
                    src={artwork.image} 
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <h4 className="font-display text-xl font-semibold text-primary mb-2">
                    {artwork.title}
                  </h4>
                  <p className="font-body text-muted-foreground mb-4">
                    {artwork.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-body text-lg font-semibold text-accent">
                        {artwork.price}
                      </p>
                      <p className="font-body text-sm text-muted-foreground">
                        {artwork.size}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-body"
                    >
                      Подробнее
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <h3 className="font-display text-4xl font-bold text-primary mb-6">
                  О художнике
                </h3>
                <div className="space-y-4 font-body text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Привет, друзья! Я - Резеда, художница, и моя страсть - создавать интерьерные картины, 
                    которые наполняют пространство особым настроением.
                  </p>
                  <p>
                    Каждый мой проект - это уникальная история, отражающая атмосферу и стиль вашего дома.
                  </p>
                  <p>
                    В своих работах я стремлюсь передать красоту окружающего мира и вдохновить вас 
                    на создание уютного уголка.
                  </p>
                  <p className="text-accent font-medium">
                    Следите за моими новыми картинами и процессом их создания! 
                    Буду рада делиться с вами своим творчеством!
                  </p>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex flex-col space-y-3 text-muted-foreground">
                    <div className="flex items-center">
                      <Icon name="Mail" size={18} className="mr-3 text-accent" />
                      <span className="font-body">rezedayunus86@gmail.com</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="Instagram" size={18} className="mr-3 text-accent" />
                      <span className="font-body">@rezeda_yunus</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="Phone" size={18} className="mr-3 text-accent" />
                      <span className="font-body">+7 (903) 318-33-22</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body">
                      <Icon name="MessageCircle" size={20} className="mr-2" />
                      Написать художнику
                    </Button>
                    <Button variant="outline" className="font-body">
                      <Icon name="Instagram" size={20} className="mr-2" />
                      Instagram
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="relative animate-scale-in">
                <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl">
                  <img 
                    src="/img/ada19162-1801-4583-88bc-753362c45292.jpg" 
                    alt="Работы Резеды"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h4 className="font-display text-2xl font-bold mb-4">
              REZEDA YUNUS GALLERY
            </h4>
            <p className="font-body text-primary-foreground/80 mb-8">
              Создаю уникальные интерьерные картины с душой
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-center items-center space-x-2 text-primary-foreground/90">
                <Icon name="Mail" size={16} className="text-accent" />
                <span className="font-body text-sm">rezedayunus86@gmail.com</span>
              </div>
              <div className="flex justify-center items-center space-x-2 text-primary-foreground/90">
                <Icon name="Instagram" size={16} className="text-accent" />
                <span className="font-body text-sm">@rezeda_yunus</span>
              </div>
              <div className="flex justify-center items-center space-x-2 text-primary-foreground/90">
                <Icon name="Phone" size={16} className="text-accent" />
                <span className="font-body text-sm">+7 (903) 318-33-22</span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-6">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-accent">
                <Icon name="Mail" size={20} />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-accent">
                <Icon name="Instagram" size={20} />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-accent">
                <Icon name="Phone" size={20} />
              </Button>
            </div>
            <div className="mt-8 pt-8 border-t border-primary-foreground/20">
              <p className="font-body text-sm text-primary-foreground/60">
                © 2024 Rezeda Gallery. Все права защищены.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}