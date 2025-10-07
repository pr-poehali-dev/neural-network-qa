import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Footer from '@/components/Footer';
import ContactButtons from '@/components/ContactButtons';
import AIChatButton from '@/components/AIChatButton';
import Navigation from '@/components/Navigation';

export default function Index() {
  const [contactInfo, setContactInfo] = useState<{whatsapp?: string; telegram?: string}>({});
  const [aiChatSettings, setAiChatSettings] = useState<{enabled: boolean; apiKey?: string; model?: string}>({ enabled: false });
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const ADMIN_PASSWORD = 'bogdan2025';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const apiKey = params.get('api');
    
    if (apiKey && apiKey.startsWith('sk-or-v1-')) {
      const settings = {
        enableAiChat: true,
        openrouterApiKey: apiKey,
        aiModel: 'google/gemini-2.0-flash-exp:free'
      };
      localStorage.setItem('site_settings', JSON.stringify(settings));
      localStorage.setItem('openrouter_api_key', apiKey);
      
      setAiChatSettings({ enabled: true, apiKey: apiKey, model: 'google/gemini-2.0-flash-exp:free' });
      window.history.replaceState({}, '', '/');
    }
  }, []);

  useEffect(() => {
    const savedSettings = localStorage.getItem('site_settings');
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        
        if (settings.aiModel === 'deepseek/deepseek-r1' || settings.aiModel === 'deepseek/deepseek-r1:free' || settings.aiModel === 'deepseek/deepseek-chat' || settings.aiModel === 'google/gemini-flash-1.5-8b') {
          settings.aiModel = 'google/gemini-2.0-flash-exp:free';
          localStorage.setItem('site_settings', JSON.stringify(settings));
        }
        
        if (settings.whatsappNumber || settings.telegramUsername) {
          setContactInfo({ whatsapp: settings.whatsappNumber, telegram: settings.telegramUsername });
        }
        
        if (settings.enableAiChat && settings.openrouterApiKey) {
          setAiChatSettings({ enabled: settings.enableAiChat, apiKey: settings.openrouterApiKey, model: settings.aiModel || 'google/gemini-2.0-flash-exp:free' });
          localStorage.setItem('openrouter_api_key', settings.openrouterApiKey);
        }
      } catch (e) {
        console.error('Ошибка парсинга настроек:', e);
      }
    }
  }, []);

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session') === 'true';
    setIsAdmin(adminSession);
  }, []);

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      localStorage.setItem('admin_session', 'true');
      setIsAdmin(true);
      setShowAdminPrompt(false);
      window.location.href = '/admin';
    } else {
      alert('Неверный пароль!');
      setAdminPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Navigation onSettingsClick={() => setShowAdminPrompt(true)} />
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzgxODNmNCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {showAdminPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-gray-700">
            <h3 className="text-white font-semibold mb-4">Вход в админ-панель</h3>
            <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} placeholder="Введите пароль" className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg mb-4 border border-gray-600 focus:border-indigo-500 outline-none" />
            <div className="flex gap-2">
              <Button onClick={handleAdminLogin} className="flex-1 bg-indigo-600 hover:bg-indigo-700">Войти</Button>
              <Button onClick={() => { setShowAdminPrompt(false); setAdminPassword(''); }} variant="outline" className="flex-1">Отмена</Button>
            </div>
          </div>
        </div>
      )}

      {showFeaturesModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setShowFeaturesModal(false)}>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-4xl w-full border border-purple-500/30 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Возможности Богдан ИИ</h2>
                <p className="text-gray-400 mt-2">Умный помощник нового поколения</p>
              </div>
              <Button onClick={() => setShowFeaturesModal(false)} variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
                <Icon name="X" size={24} />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Zap" className="text-yellow-400" size={24} />
                  <h3 className="font-bold text-white text-lg">30+ специальных функций</h3>
                </div>
                <p className="text-gray-300 text-sm">Готовые шаблоны для текстов, бизнеса, кода, креатива, анализа и обучения</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { emoji: '💬', title: 'Диалоги', desc: 'Ответы на любые вопросы', gradient: 'from-blue-500 to-cyan-500' },
                  { emoji: '📝', title: 'Статьи', desc: 'SEO-тексты для блога', gradient: 'from-purple-500 to-pink-500' },
                  { emoji: '✉️', title: 'Email', desc: 'Деловые письма', gradient: 'from-indigo-500 to-purple-500' },
                  { emoji: '📱', title: 'Соцсети', desc: '10 постов за раз', gradient: 'from-pink-500 to-rose-500' },
                  { emoji: '🛍️', title: 'Описание товара', desc: 'Для интернет-магазина', gradient: 'from-emerald-500 to-teal-500' },
                  { emoji: '❓', title: 'FAQ', desc: '15 вопросов-ответов', gradient: 'from-blue-400 to-cyan-400' },
                  { emoji: '📰', title: 'Пресс-релиз', desc: 'Для СМИ и медиа', gradient: 'from-slate-600 to-gray-600' },
                  { emoji: '📢', title: 'Объявление', desc: 'Для площадки или группы', gradient: 'from-sky-500 to-blue-500' },
                  { emoji: '💌', title: 'Письмо клиенту', desc: 'Поддержка и забота', gradient: 'from-rose-500 to-pink-500' },
                  { emoji: '📄', title: 'Договор', desc: 'Шаблон соглашения', gradient: 'from-gray-600 to-slate-600' },
                  { emoji: '💼', title: 'Бизнес-план', desc: 'Полный план проекта', gradient: 'from-gray-700 to-gray-900' },
                  { emoji: '📊', title: 'SWOT-анализ', desc: 'Анализ бизнеса', gradient: 'from-orange-500 to-red-500' },
                  { emoji: '🎯', title: 'Презентация', desc: 'Структура слайдов', gradient: 'from-teal-500 to-cyan-500' },
                  { emoji: '📈', title: 'Маркетинг-план', desc: 'Стратегия продвижения', gradient: 'from-green-600 to-emerald-600' },
                  { emoji: '👥', title: 'Анализ конкурентов', desc: 'Кто главные игроки', gradient: 'from-red-600 to-orange-600' },
                  { emoji: '📞', title: 'Скрипт продаж', desc: 'Диалог с клиентом', gradient: 'from-purple-600 to-pink-600' },
                  { emoji: '💰', title: 'Финмодель', desc: 'Финансовый прогноз', gradient: 'from-emerald-600 to-teal-600' },
                  { emoji: '🎁', title: 'Акция', desc: 'Промо-предложение', gradient: 'from-fuchsia-500 to-pink-500' },
                  { emoji: '📣', title: 'Рекламный текст', desc: 'Продающий креатив', gradient: 'from-orange-600 to-red-600' },
                  { emoji: '🐍', title: 'Python код', desc: 'Готовые скрипты', gradient: 'from-blue-600 to-indigo-600' },
                  { emoji: '⚛️', title: 'React компонент', desc: 'UI элемент', gradient: 'from-cyan-600 to-blue-600' },
                  { emoji: '🗄️', title: 'SQL запросы', desc: 'База данных', gradient: 'from-teal-600 to-cyan-600' },
                  { emoji: '🔍', title: 'RegEx', desc: 'Регулярные выражения', gradient: 'from-green-600 to-emerald-600' },
                  { emoji: '🌐', title: 'HTML+CSS', desc: 'Готовая веб-страница', gradient: 'from-orange-600 to-red-600' },
                  { emoji: '🔌', title: 'API интеграция', desc: 'Работа с API', gradient: 'from-cyan-600 to-blue-600' },
                  { emoji: '✅', title: 'Unit-тесты', desc: 'Тестирование кода', gradient: 'from-lime-600 to-green-600' },
                  { emoji: '🐛', title: 'Отладка кода', desc: 'Найти и исправить баг', gradient: 'from-red-600 to-rose-600' },
                  { emoji: '⚡', title: 'Оптимизация', desc: 'Ускорить код', gradient: 'from-yellow-600 to-orange-600' },
                  { emoji: '📦', title: 'Docker файл', desc: 'Контейнеризация', gradient: 'from-blue-700 to-indigo-700' },
                  { emoji: '📖', title: 'Истории', desc: 'Рассказы и сценарии', gradient: 'from-yellow-500 to-orange-500' },
                  { emoji: '💡', title: 'Нейминг', desc: '20 названий', gradient: 'from-pink-500 to-purple-500' },
                  { emoji: '🎨', title: 'Слоганы', desc: 'УТП и слоганы', gradient: 'from-cyan-500 to-blue-500' },
                  { emoji: '🎬', title: 'Сценарий видео', desc: 'YouTube, TikTok', gradient: 'from-red-500 to-rose-500' },
                  { emoji: '❔', title: 'Создать квиз', desc: '10 вопросов', gradient: 'from-violet-500 to-fuchsia-500' },
                  { emoji: '✍️', title: 'Стихи', desc: 'Красивые стихотворения', gradient: 'from-sky-500 to-blue-500' },
                  { emoji: '🎵', title: 'Текст песни', desc: 'Рифмованные куплеты', gradient: 'from-purple-600 to-pink-600' },
                  { emoji: '🎭', title: 'Шутки', desc: '10 весёлых шуток', gradient: 'from-amber-500 to-yellow-500' },
                  { emoji: '🎪', title: 'Игра', desc: 'Текстовый квест', gradient: 'from-rose-500 to-red-500' },
                  { emoji: '📄', title: 'Краткое резюме', desc: 'Суть текста', gradient: 'from-violet-500 to-purple-500' },
                  { emoji: '⚖️', title: 'Плюсы и минусы', desc: 'Объективная оценка', gradient: 'from-amber-500 to-orange-500' },
                  { emoji: '🛡️', title: 'Проверка фактов', desc: 'Анализ информации', gradient: 'from-red-500 to-pink-500' },
                  { emoji: '✨', title: 'Улучшить текст', desc: 'Исправления и стиль', gradient: 'from-indigo-500 to-blue-500' },
                  { emoji: '🔄', title: 'Сравнить', desc: 'Выбор лучшего', gradient: 'from-fuchsia-500 to-pink-500' },
                  { emoji: '🗺️', title: 'Дорожная карта', desc: 'План на 12 месяцев', gradient: 'from-amber-500 to-orange-500' },
                  { emoji: '🔮', title: 'Прогноз', desc: 'Что будет через год', gradient: 'from-violet-600 to-purple-600' },
                  { emoji: '🎲', title: 'Идеи', desc: '20 креативных идей', gradient: 'from-pink-600 to-rose-600' },
                  { emoji: '🧩', title: 'Решение проблемы', desc: 'Пошаговый план', gradient: 'from-green-600 to-emerald-600' },
                  { emoji: '👶', title: 'Объясни просто', desc: 'Как для ребёнка', gradient: 'from-green-400 to-emerald-400' },
                  { emoji: '🎓', title: 'План обучения', desc: 'Как изучить с нуля', gradient: 'from-blue-500 to-indigo-500' },
                  { emoji: '📋', title: 'Шпаргалка', desc: 'Краткая справка', gradient: 'from-purple-500 to-pink-500' },
                  { emoji: '📝', title: 'Практика', desc: '10 заданий', gradient: 'from-orange-500 to-red-500' },
                  { emoji: '🎯', title: 'Цели SMART', desc: 'Постановка целей', gradient: 'from-teal-600 to-cyan-600' },
                  { emoji: '📚', title: 'Конспект', desc: 'Краткий пересказ', gradient: 'from-indigo-600 to-blue-600' },
                  { emoji: '🖼️', title: 'Анализ фото', desc: 'Описание изображений', gradient: 'from-green-500 to-emerald-500' },
                  { emoji: '🎤', title: 'Голос', desc: 'Речь → текст', gradient: 'from-violet-500 to-purple-500' },
                  { emoji: '🌍', title: 'Переводы', desc: '100+ языков', gradient: 'from-red-500 to-orange-500' }
                ].map((item, idx) => (
                  <div key={idx} className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer">
                    <div className={`inline-flex w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} mb-3 text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      {item.emoji}
                    </div>
                    <h3 className="font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">{item.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-400/30">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Rocket" className="text-blue-400" size={28} />
                  <h3 className="font-bold text-white text-xl">Начните прямо сейчас!</h3>
                </div>
                <p className="text-gray-300 mb-4">Просто начните диалог или выберите готовую функцию из меню «Спец. функции»</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/40 rounded-full text-xs text-white font-medium backdrop-blur-sm">✨ 70+ функций</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-400/40 rounded-full text-xs text-white font-medium backdrop-blur-sm">🎉 Бесплатно</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-pink-500/30 to-rose-500/30 border border-pink-400/40 rounded-full text-xs text-white font-medium backdrop-blur-sm">🚀 Без регистрации</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-400/40 rounded-full text-xs text-white font-medium backdrop-blur-sm">⚡ Быстрые ответы</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="relative z-10 pt-16">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <div className="inline-block p-5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl mb-6 border border-white/20 backdrop-blur-sm animate-float">
                  <Icon name="Sparkles" className="w-16 h-16 text-white" />
                </div>
                
                <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                  Богдан ИИ
                </h1>
                <p className="text-xl text-gray-200 mb-4 font-medium">Ваш персональный ИИ-помощник нового поколения</p>
                <p className="text-sm text-gray-400 mb-8">Анализ изображений • Голосовой ввод • Работа с документами • 70+ функций</p>

                <Button 
                  onClick={() => setShowFeaturesModal(true)} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-base px-6 py-6"
                >
                  <Icon name="Zap" className="mr-2" size={20} />
                  Узнать возможности
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: 'MessageSquare', title: 'Общение', desc: 'Вопросы и ответы', gradient: 'from-blue-500 to-cyan-500' },
                  { icon: 'FileText', title: 'Тексты', desc: 'Статьи, письма', gradient: 'from-purple-500 to-pink-500' },
                  { icon: 'Folder', title: 'Документы', desc: 'Анализ файлов', gradient: 'from-orange-500 to-red-500' },
                  { icon: 'ImageIcon', title: 'Изображения', desc: 'Анализ фото', gradient: 'from-green-500 to-emerald-500' },
                  { icon: 'Mic', title: 'Голос', desc: 'Распознавание речи', gradient: 'from-indigo-500 to-purple-500' },
                  { icon: 'Globe', title: 'Переводы', desc: '100+ языков', gradient: 'from-teal-500 to-cyan-500' }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="group bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:bg-white/10 cursor-pointer"
                  >
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${item.gradient} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon name={item.icon as any} className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-4">
              {aiChatSettings.enabled ? (
                <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 h-[85vh] min-h-[700px] overflow-hidden">
                  <AIChatButton apiKey={aiChatSettings.apiKey} model={aiChatSettings.model} embedded={true} isAdmin={isAdmin} />
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-10 border border-white/20 text-center">
                  <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 mb-6">
                    <Icon name="Bot" size={48} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">Чат не активирован</h3>
                  <p className="text-gray-300 mb-4">Для активации чата добавьте API ключ OpenRouter</p>
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 mb-6 text-left">
                    <p className="text-blue-200 text-sm mb-2">📝 Как активировать:</p>
                    <ol className="text-gray-300 text-xs space-y-1 list-decimal list-inside">
                      <li>Откройте URL с параметром: <code className="bg-white/10 px-1 rounded">?api=ваш_ключ</code></li>
                      <li>Или используйте админ-панель для настройки</li>
                    </ol>
                  </div>
                  <Button 
                    onClick={() => setShowAdminPrompt(true)} 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Icon name="Settings" className="mr-2" size={18} />
                    Открыть настройки
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
        <ContactButtons whatsapp={contactInfo.whatsapp} telegram={contactInfo.telegram} />
      </div>
    </div>
  );
}