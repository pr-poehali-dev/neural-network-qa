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
      setShowAdminPrompt(false);
      window.location.href = '/admin';
    } else {
      alert('Неверный пароль!');
      setAdminPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZmMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="fixed top-4 right-4 z-50">
        <Button onClick={() => setShowAdminPrompt(true)} size="sm" variant="ghost" className="bg-gray-800/50 hover:bg-gray-700/50 text-white backdrop-blur-sm">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowFeaturesModal(false)}>
          <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Возможности сервиса "Богдан ИИ"</h2>
              <Button onClick={() => setShowFeaturesModal(false)} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { emoji: '💬', title: 'Общение', desc: 'Задавайте вопросы, получайте умные ответы на любые темы' },
                { emoji: '📝', title: 'Создание текстов', desc: 'Статьи, письма, посты для соцсетей, коммерческие предложения' },
                { emoji: '📄', title: 'Анализ документов', desc: 'Загрузите файл — AI прочитает и ответит на вопросы' },
                { emoji: '🖼️', title: 'Анализ изображений', desc: 'Распознавание объектов, описание фото, извлечение текста' },
                { emoji: '🎤', title: 'Голосовой ввод', desc: 'Говорите — AI распознает речь и ответит текстом' },
                { emoji: '🌍', title: 'Переводы', desc: 'Автоопределение языка, перевод на 100+ языков' },
                { emoji: '📊', title: 'Резюме и анализ', desc: 'Краткое изложение длинных текстов, выводы, рекомендации' },
                { emoji: '🎨', title: 'Креатив', desc: 'Истории, стихи, сценарии, названия для проектов' }
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <div className="inline-block p-4 bg-gray-800 rounded-full shadow-xl mb-4 border-2 border-indigo-500/30">
                  <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Богдан ИИ</h1>
                <p className="text-lg text-gray-300 mb-6">Ваш умный помощник с искусственным интеллектом</p>

                <Button onClick={() => setShowFeaturesModal(true)} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white mb-6">
                  <Icon name="Info" className="mr-2" size={18} />
                  О возможностях сервиса
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: '💬', title: 'Общение', desc: 'Вопросы и ответы' },
                  { emoji: '📝', title: 'Тексты', desc: 'Статьи, письма' },
                  { emoji: '📄', title: 'Документы', desc: 'Анализ файлов' },
                  { emoji: '🖼️', title: 'Изображения', desc: 'Анализ фото' },
                  { emoji: '🎤', title: 'Голос', desc: 'Распознавание речи' },
                  { emoji: '🌍', title: 'Переводы', desc: '100+ языков' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-4">
              {aiChatSettings.enabled ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 h-[600px]">
                  <AIChatButton apiKey={aiChatSettings.apiKey} model={aiChatSettings.model} embedded={true} />
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
                  <Icon name="Bot" size={64} className="mx-auto mb-4 text-gray-600" />
                  <h3 className="text-white font-semibold mb-2">Чат не активирован</h3>
                  <p className="text-gray-400 text-sm mb-4">Для активации перейдите в админ-панель и добавьте API ключ</p>
                  <Button onClick={() => setShowAdminPrompt(true)} className="bg-indigo-600 hover:bg-indigo-700">Настроить</Button>
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
