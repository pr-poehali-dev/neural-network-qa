import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';

export default function Favorites() {
  const [favorites, setFavorites] = useState<Array<{ text: string; role: string; timestamp: string }>>([]);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const removeFavorite = (index: number) => {
    const updated = favorites.filter((_, i) => i !== index);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZmMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>
      
      <div className="relative z-10">
        <header className="border-b border-white/20 backdrop-blur-md bg-white/30 dark:bg-gray-900/30 dark:border-gray-700/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Icon name="Star" className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Избранное
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
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-500 bg-clip-text text-transparent">
              ⭐ Избранные сообщения
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ваши самые важные и интересные сообщения
            </p>
          </section>

          <div className="max-w-4xl mx-auto space-y-4">
            {favorites.length === 0 ? (
              <Card className="p-12 text-center border-2 border-purple-200 dark:border-purple-800 dark:bg-gray-800">
                <Icon name="Star" className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Пока нет избранных сообщений
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Нажимайте на звёздочку рядом с сообщениями, чтобы добавить их в избранное
                </p>
              </Card>
            ) : (
              favorites.map((fav, index) => (
                <Card key={index} className="p-6 border-2 border-purple-200 dark:border-purple-800 dark:bg-gray-800 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon 
                          name={fav.role === 'user' ? 'User' : 'Bot'} 
                          className={fav.role === 'user' ? 'text-purple-600' : 'text-indigo-600'} 
                          size={18} 
                        />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(fav.timestamp).toLocaleString('ru-RU')}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{fav.text}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFavorite(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {favorites.length > 0 && (
            <div className="text-center mt-8">
              <Button 
                onClick={() => window.location.href = '/'}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8"
              >
                <Icon name="ArrowLeft" className="mr-2" size={20} />
                Вернуться к чату
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
