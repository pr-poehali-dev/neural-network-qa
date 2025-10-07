import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Footer from '@/components/Footer';
import ContactButtons from '@/components/ContactButtons';
import AIChatButton from '@/components/AIChatButton';

export default function Index() {
  const [contactInfo, setContactInfo] = useState<{whatsapp?: string; telegram?: string}>({});
  const [aiChatSettings, setAiChatSettings] = useState<{enabled: boolean; apiKey?: string; model?: string}>({ enabled: false });
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

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

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      localStorage.setItem('admin_session', 'true');
      setShowAdminPrompt(false);
      window.location.href = '/admin';
    } else {
      alert('Неверный пароль!');
      setAdminPassword('');
    }
  };

  const isAdmin = localStorage.getItem('admin_session') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzgxODNmNCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="fixed top-4 right-4 z-50">
        <Button 
          onClick={() => setShowAdminPrompt(true)} 
          size="sm" 
          variant="ghost" 
          className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110"
        >
          <Icon name="Settings" size={16} />
        </Button>
      </div>

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
                <p className="text-gray-400 mt-2">Powered by Google Gemini 2.0 Flash</p>
              </div>
              <Button onClick={() => setShowFeaturesModal(false)} variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
                <Icon name="X" size={24} />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Zap" className="text-yellow-400" size={24} />
                  <h3 className="font-bold text-white text-lg">15+ специальных функций</h3>
                </div>
                <p className="text-gray-300 text-sm">Готовые шаблоны для бизнеса, кода, креатива и анализа</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { emoji: '💬', title: 'Диалоги', desc: 'Ответы на любые вопросы', gradient: 'from-blue-500 to-cyan-500' },
                  { emoji: '📝', title: 'Статьи', desc: 'SEO-тексты для блога', gradient: 'from-purple-500 to-pink-500' },
                  { emoji: '✉️', title: 'Email', desc: 'Деловые письма', gradient: 'from-indigo-500 to-purple-500' },
                  { emoji: '📱', title: 'Соцсети', desc: '10 постов за раз', gradient: 'from-pink-500 to-rose-500' },
                  { emoji: '💼', title: 'Бизнес-план', desc: 'Полный план проекта', gradient: 'from-gray-700 to-gray-900' },
                  { emoji: '📊', title: 'SWOT-анализ', desc: 'Анализ бизнеса', gradient: 'from-orange-500 to-red-500' },
                  { emoji: '🎯', title: 'Презентация', desc: 'Структура слайдов', gradient: 'from-teal-500 to-cyan-500' },
                  { emoji: '🐍', title: 'Python код', desc: 'Готовые скрипты', gradient: 'from-blue-600 to-indigo-600' },
                  { emoji: '🗄️', title: 'SQL запросы', desc: 'База данных', gradient: 'from-green-600 to-emerald-600' },
                  { emoji: '📖', title: 'Истории', desc: 'Рассказы и сценарии', gradient: 'from-yellow-500 to-orange-500' },
                  { emoji: '💡', title: 'Нейминг', desc: '20 названий', gradient: 'from-pink-500 to-purple-500' },
                  { emoji: '🎨', title: 'Слоганы', desc: 'УТП и слоганы', gradient: 'from-cyan-500 to-blue-500' },
                  { emoji: '🖼️', title: 'Анализ фото', desc: 'Описание изображений', gradient: 'from-green-500 to-emerald-500' },
                  { emoji: '🎤', title: 'Голос', desc: 'Речь → текст', gradient: 'from-violet-500 to-purple-500' },
                  { emoji: '🌍', title: 'Переводы', desc: '100+ языков', gradient: 'from-red-500 to-orange-500' }
                ].map((item, idx) => (
                  <div key={idx} className="group bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:bg-white/10">
                    <div className={`inline-flex w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} mb-3 text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {item.emoji}
                    </div>
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
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
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">Gemini 2.0 Flash</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">Бесплатно</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">Без регистрации</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">Быстрые ответы</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="relative z-10">
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
                <p className="text-sm text-gray-400 mb-8">Анализ изображений • Голосовой ввод • Работа с документами • Gemini 2.0 Flash</p>

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
                <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 h-[650px] overflow-hidden">
                  <AIChatButton apiKey={aiChatSettings.apiKey} model={aiChatSettings.model} embedded={true} isAdmin={isAdmin} />
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-10 border border-white/20 text-center">
                  <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 mb-6">
                    <Icon name="Bot" size={48} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">Чат не активирован</h3>
                  <p className="text-gray-300 mb-6">Добавьте API ключ для начала работы</p>
                  <Button 
                    onClick={() => setShowAdminPrompt(true)} 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Icon name="Settings" className="mr-2" size={18} />
                    Настроить
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