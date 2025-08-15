import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import ContactModal from "@/components/ContactModal";
import PaymentModal from "@/components/PaymentModal";

export default function ArtworkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const artworks = [
    {
      id: 1,
      title: "Фрагменты",
      description: "Абстрактное произведение с геометрическими формами в черно-белой гамме. Динамичная композиция символизирует взаимодействие различных элементов и идей",
      fullDescription: "Картина «Фрагменты» представляет собой абстрактное произведение, в котором сочетаются яркие и приглушенные цвета, создавая динамичную и многослойную композицию. В центре работы расположены геометрические формы, которые пересекаются и накладываются друг на друга, символизируя взаимодействие различных элементов и идей. Текстуры варьируются от гладких до грубых, что добавляет глубину и интерес к восприятию. Общая атмосфера картины вызывает чувство движения и изменения, что позволяет зрителю интерпретировать её по-своему, находя в ней отражение собственных эмоций и мыслей.",
      price: "25 000 ₽",
      size: "60x80 см",
      technique: "Акрил на холсте",
      year: "2024",
      image: "https://cdn.poehali.dev/files/6c543c82-ec8a-4fe3-a862-fb512b1f8793.jpg",
      images: [
        {
          url: "https://cdn.poehali.dev/files/6c543c82-ec8a-4fe3-a862-fb512b1f8793.jpg",
          title: "Общий вид"
        },
        {
          url: "/img/5ab628e4-c8df-45bd-8d93-c66268b3d6e3.jpg",
          title: "Фрагмент крупным планом"
        },
        {
          url: "/img/e47fe32a-723c-4997-8ee0-606e76e0b662.jpg",
          title: "В интерьере"
        }
      ]
    },
    {
      id: 2,
      title: "Земля и песок",
      description: "Теплая абстракция в терракотовых тонах",
      fullDescription: "Работа выполнена в теплых земляных тонах, создавая ощущение природной гармонии и уюта. Идеально подходит для современных интерьеров.",
      price: "16 000 ₽",
      size: "60x80 см",
      technique: "Акрил на холсте",
      year: "2024",
      image: "/img/9b37b688-e631-4dd5-ad59-babfa4bf7431.jpg",
      images: [
        {
          url: "/img/9b37b688-e631-4dd5-ad59-babfa4bf7431.jpg",
          title: "Общий вид"
        },
        {
          url: "/img/b0aa6be1-68e6-4a3a-b699-684febcc9ce1.jpg",
          title: "Фрагмент крупным планом"
        },
        {
          url: "/img/e47fe32a-723c-4997-8ee0-606e76e0b662.jpg",
          title: "В интерьере"
        }
      ]
    },
    {
      id: 3,
      title: "Нежность утра",
      description: "Пастельная композиция в розово-кремовых оттенках",
      fullDescription: "Нежная и воздушная работа, выполненная в пастельных тонах. Создает атмосферу спокойствия и умиротворения в любом пространстве.",
      price: "14 000 ₽",
      size: "50x70 см",
      technique: "Акрил на холсте",
      year: "2024",
      image: "/img/9df82178-702a-4a4f-a7e9-61406a27ce93.jpg",
      images: [
        {
          url: "/img/9df82178-702a-4a4f-a7e9-61406a27ce93.jpg",
          title: "Общий вид"
        },
        {
          url: "/img/d118ec36-a5ef-4c4a-882e-52c8bf6f4888.jpg",
          title: "Фрагмент крупным планом"
        },
        {
          url: "/img/e47fe32a-723c-4997-8ee0-606e76e0b662.jpg",
          title: "В интерьере"
        }
      ]
    },
    {
      id: 4,
      title: "Морской бриз",
      description: "Спокойная абстракция в сине-белых тонах",
      fullDescription: "Вдохновленная морскими пейзажами, эта картина передает свежесть и легкость морского бриза. Идеально подходит для создания расслабляющей атмосферы.",
      price: "18 000 ₽",
      size: "70x90 см",
      technique: "Акрил на холсте",
      year: "2024",
      image: "/img/8e767619-f079-49ee-b5b0-b135543d2aec.jpg",
      images: [
        {
          url: "/img/8e767619-f079-49ee-b5b0-b135543d2aec.jpg",
          title: "Общий вид"
        },
        {
          url: "/img/6582d4f3-17f2-4da7-8993-22373d86d56a.jpg",
          title: "Фрагмент крупным планом"
        },
        {
          url: "/img/e47fe32a-723c-4997-8ee0-606e76e0b662.jpg",
          title: "В интерьере"
        }
      ]
    },
    {
      id: 5,
      title: "Гармония форм",
      description: "Абстрактная композиция в теплых тонах",
      fullDescription: "Сбалансированная композиция из геометрических и органических форм создает ощущение гармонии и целостности. Универсальная работа для любого интерьера.",
      price: "15 000 ₽",
      size: "60x80 см",
      technique: "Акрил на холсте",
      year: "2024",
      image: "/img/ada19162-1801-4583-88bc-753362c45292.jpg",
      images: [
        {
          url: "/img/ada19162-1801-4583-88bc-753362c45292.jpg",
          title: "Общий вид"
        },
        {
          url: "/img/b0aa6be1-68e6-4a3a-b699-684febcc9ce1.jpg",
          title: "Фрагмент крупным планом"
        },
        {
          url: "/img/e47fe32a-723c-4997-8ee0-606e76e0b662.jpg",
          title: "В интерьере"
        }
      ]
    },
    {
      id: 6,
      title: "Потоки света",
      description: "Минималистичная работа в пастельных оттенках",
      fullDescription: "Легкая и воздушная композиция, передающая игру света и тени. Минималистичный подход делает эту работу идеальной для современных интерьеров.",
      price: "12 000 ₽",
      size: "50x70 см",
      technique: "Акрил на холсте",
      year: "2024",
      image: "/img/994681b9-75b3-4922-9e23-f5bf0850b377.jpg",
      images: [
        {
          url: "/img/994681b9-75b3-4922-9e23-f5bf0850b377.jpg",
          title: "Общий вид"
        },
        {
          url: "/img/d118ec36-a5ef-4c4a-882e-52c8bf6f4888.jpg",
          title: "Фрагмент крупным планом"
        },
        {
          url: "/img/e47fe32a-723c-4997-8ee0-606e76e0b662.jpg",
          title: "В интерьере"
        }
      ]
    }
  ];

  const artwork = artworks.find(art => art.id === parseInt(id || "1"));

  if (!artwork) {
    return <div>Картина не найдена</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="font-display text-2xl font-bold text-primary">
              REZEDA YUNUS GALLERY
            </h1>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="font-body"
            >
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад к галерее
            </Button>
          </div>
        </div>
      </nav>

      {/* Artwork Detail */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Images */}
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl">
                  <img 
                    src={artwork.images && artwork.images.length > 0 ? artwork.images[selectedImage].url : artwork.image} 
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {artwork.images && artwork.images.length > 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {artwork.images.map((img, index) => (
                        <div 
                          key={index} 
                          onClick={() => setSelectedImage(index)}
                          className={`relative aspect-square rounded overflow-hidden cursor-pointer ${selectedImage === index ? 'ring-2 ring-accent' : ''}`}
                        >
                          <img 
                            src={img.url} 
                            alt={img.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 text-center">
                            {img.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-4xl font-bold text-primary mb-4">
                    {artwork.title}
                  </h1>
                  <p className="font-body text-2xl font-semibold text-accent mb-6">
                    {artwork.price}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="Ruler" size={20} className="text-muted-foreground" />
                    <span className="font-body text-lg">{artwork.size}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="Palette" size={20} className="text-muted-foreground" />
                    <span className="font-body text-lg">{artwork.technique}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="Calendar" size={20} className="text-muted-foreground" />
                    <span className="font-body text-lg">{artwork.year}</span>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {artwork.fullDescription}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button 
                    size="lg" 
                    onClick={() => setPaymentModalOpen(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-body flex-1"
                  >
                    <Icon name="ShoppingCart" size={20} className="mr-2" />
                    Купить картину
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => setContactModalOpen(true)}
                    className="font-body flex-1"
                  >
                    <Icon name="MessageCircle" size={20} className="mr-2" />
                    Задать вопрос
                  </Button>
                </div>

                <div className="border-t pt-6 mt-8">
                  <h3 className="font-display text-xl font-semibold mb-4">
                    Контакты художника
                  </h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex items-center">
                      <Icon name="Mail" size={16} className="mr-3 text-accent" />
                      <span className="font-body text-sm">rezedayunus86@gmail.com</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="Instagram" size={16} className="mr-3 text-accent" />
                      <span className="font-body text-sm">@rezeda_yunus</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="Phone" size={16} className="mr-3 text-accent" />
                      <span className="font-body text-sm">+7 (903) 318-33-22</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <ContactModal 
        open={contactModalOpen} 
        onOpenChange={setContactModalOpen}
        artworkTitle={artwork.title}
      />
      
      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        artwork={artwork}
      />
    </div>
  );
}