import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZmMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>
      
      <div className="relative z-10">
        <header className="border-b border-white/20 backdrop-blur-md bg-white/30">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Icon name="Brain" className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Умный Помощник
                </h1>
              </div>
              <nav className="flex gap-6 items-center">
                <a href="/" className="text-gray-700 hover:text-indigo-600 transition-colors">Главная</a>
                <a href="/about" className="text-indigo-600 font-medium">О сервисе</a>
                <a href="/admin" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  <Icon name="Shield" className="inline mr-1" size={16} />
                  Админ
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <section className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              О сервисе
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Современный AI-ассистент для работы с данными
            </p>
          </section>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="p-8 border-2 border-purple-200 animate-slide-up">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Icon name="Sparkles" className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Что это такое?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Умный Помощник — это интеллектуальная платформа, которая использует современные языковые модели AI (Grok, GPT-4) для анализа данных и ответов на вопросы. Система позволяет загружать документы через админ-панель и получать мгновенные ответы на любые вопросы.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2 border-purple-200 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Icon name="Zap" className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Возможности</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <Icon name="Check" className="text-green-600 mt-1 flex-shrink-0" size={20} />
                      <span><strong>Интеллектуальный чат</strong> — задавайте вопросы на русском языке и получайте точные ответы</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="Check" className="text-green-600 mt-1 flex-shrink-0" size={20} />
                      <span><strong>История диалогов</strong> — все чаты сохраняются в базе данных</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="Check" className="text-green-600 mt-1 flex-shrink-0" size={20} />
                      <span><strong>Экспорт данных</strong> — сохраняйте важные диалоги в текстовые файлы</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="Check" className="text-green-600 mt-1 flex-shrink-0" size={20} />
                      <span><strong>Админ-панель</strong> — управление данными и загрузка документов</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="Check" className="text-green-600 mt-1 flex-shrink-0" size={20} />
                      <span><strong>Поддержка Grok и GPT-4</strong> — выбор лучшей AI-модели для ваших задач</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2 border-purple-200 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <Icon name="Shield" className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Безопасность и приватность</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Ваши данные надежно защищены. Все диалоги хранятся в защищенной базе данных PostgreSQL. Доступ к админ-панели защищен паролем. API ключи хранятся в зашифрованном виде и недоступны извне.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-lg">
                      <Icon name="Lock" className="text-indigo-600" size={20} />
                      <span className="text-sm text-gray-700">Шифрование данных</span>
                    </div>
                    <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-lg">
                      <Icon name="Database" className="text-purple-600" size={20} />
                      <span className="text-sm text-gray-700">Защищенная БД</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2 border-purple-200 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Icon name="Rocket" className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Технологии</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg">
                      <p className="font-semibold text-gray-900 mb-1">Frontend</p>
                      <p className="text-sm text-gray-600">React + TypeScript + Tailwind CSS</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-cyan-50 p-4 rounded-lg">
                      <p className="font-semibold text-gray-900 mb-1">Backend</p>
                      <p className="text-sm text-gray-600">Python + Cloud Functions</p>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-indigo-50 p-4 rounded-lg">
                      <p className="font-semibold text-gray-900 mb-1">AI</p>
                      <p className="text-sm text-gray-600">Grok + GPT-4</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="text-center pt-8">
              <Button 
                onClick={() => window.location.href = '/'}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8"
              >
                <Icon name="ArrowLeft" className="mr-2" size={20} />
                Вернуться к чату
              </Button>
            </div>
          </div>
        </main>

        <footer className="border-t border-purple-200 mt-20 py-8 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 text-center text-gray-600">
            <p>© 2024 Умный Помощник. Все права защищены.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
