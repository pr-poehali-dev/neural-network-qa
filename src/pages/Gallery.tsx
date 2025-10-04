import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const demoFeatures = [
  {
    title: '🎨 Красивый дизайн',
    description: 'Современный градиентный интерфейс с анимациями',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop'
  },
  {
    title: '🌓 Темная тема',
    description: 'Переключение между светлой и темной темой',
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&h=600&fit=crop'
  },
  {
    title: '💬 Чат интерфейс',
    description: 'Удобный интерфейс как в Telegram или WhatsApp',
    image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=600&fit=crop'
  },
  {
    title: '📱 Адаптивность',
    description: 'Отлично работает на всех устройствах',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop'
  },
  {
    title: '⌨️ Анимация печати',
    description: 'Текст AI появляется постепенно, как в ChatGPT',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop'
  },
  {
    title: '🎨 Цветовые схемы',
    description: 'Выбирайте фиолетовую, синюю, зелёную или розовую тему',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=600&fit=crop'
  }
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZmMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>
      
      <div className="relative z-10">
        <header className="border-b border-white/20 backdrop-blur-md bg-white/30 dark:bg-gray-900/30 dark:border-gray-700/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                  <Icon name="Image" className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                  Галерея
                </h1>
              </div>
              <nav className="flex gap-4 items-center">
                <a href="/" className="text-gray-700 hover:text-indigo-600 transition-colors dark:text-gray-300 dark:hover:text-indigo-400">Главная</a>
                <a href="/about" className="text-gray-700 hover:text-indigo-600 transition-colors dark:text-gray-300 dark:hover:text-indigo-400">О сервисе</a>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <section className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-orange-600 to-red-500 bg-clip-text text-transparent">
              🖼️ Галерея возможностей
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Посмотрите на все крутые фичи чат-бота
            </p>
          </section>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {demoFeatures.map((feature, index) => (
              <Card 
                key={index}
                className="overflow-hidden border-2 border-purple-200 dark:border-purple-800 dark:bg-gray-800 hover:shadow-2xl transition-all hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900 dark:to-cyan-900 relative overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={() => window.location.href = '/'}
              size="lg"
              className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-lg px-8"
            >
              <Icon name="Sparkles" className="mr-2" size={20} />
              Попробовать сейчас
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
