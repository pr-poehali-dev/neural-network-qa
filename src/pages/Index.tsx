import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import ContactButtons from '@/components/ContactButtons';
import AIChatButton from '@/components/AIChatButton';

export default function Index() {
  const [contactInfo, setContactInfo] = useState<{whatsapp?: string; telegram?: string}>({});
  const [aiChatSettings, setAiChatSettings] = useState<{enabled: boolean; apiKey?: string; model?: string}>({ enabled: false });
  const [diagnostic, setDiagnostic] = useState<{status: 'idle' | 'checking' | 'success' | 'error'; message?: string}>({ status: 'idle' });

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
      
      setAiChatSettings({
        enabled: true,
        apiKey: apiKey,
        model: 'google/gemini-2.0-flash-exp:free'
      });
      
      window.history.replaceState({}, '', '/');
      
      setDiagnostic({ 
        status: 'success', 
        message: '✅ API ключ сохранён! Чат активирован с бесплатной моделью Gemini 2.0 Flash' 
      });
      
      setTimeout(() => setDiagnostic({ status: 'idle' }), 5000);
    }
  }, []);

  useEffect(() => {
    const savedSettings = localStorage.getItem('site_settings');
    console.log('🔍 Загружаю настройки:', savedSettings);
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        
        if (settings.aiModel === 'deepseek/deepseek-r1' || 
            settings.aiModel === 'deepseek/deepseek-r1:free' || 
            settings.aiModel === 'deepseek/deepseek-chat' ||
            settings.aiModel === 'google/gemini-flash-1.5-8b') {
          console.warn('🔧 Автомиграция: переключаю на бесплатную модель Gemini 2.0 Flash');
          settings.aiModel = 'google/gemini-2.0-flash-exp:free';
          localStorage.setItem('site_settings', JSON.stringify(settings));
        }
        
        console.log('📦 Распарсил настройки:', settings);
        
        if (settings.whatsappNumber || settings.telegramUsername) {
          setContactInfo({
            whatsapp: settings.whatsappNumber,
            telegram: settings.telegramUsername
          });
        }
        
        if (settings.enableAiChat && settings.openrouterApiKey) {
          console.log('✅ AI чат включён!', { model: settings.aiModel });
          setAiChatSettings({
            enabled: settings.enableAiChat,
            apiKey: settings.openrouterApiKey,
            model: settings.aiModel || 'google/gemini-2.0-flash-exp:free'
          });
          localStorage.setItem('openrouter_api_key', settings.openrouterApiKey);
        } else {
          console.warn('⚠️ AI чат не включён:', {
            enableAiChat: settings.enableAiChat,
            hasApiKey: !!settings.openrouterApiKey
          });
        }
      } catch (e) {
        console.error('❌ Ошибка парсинга настроек:', e);
      }
    } else {
      console.warn('⚠️ Настройки не найдены в localStorage');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZmMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="relative z-10">
        <main className="container mx-auto px-6 py-20">
          <section className="text-center mb-16 animate-fade-in">
            <div className="mb-8">
              <div className="inline-block p-6 bg-gray-800 rounded-full shadow-2xl mb-6 border-4 border-indigo-500/30">
                <svg className="w-20 h-20 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Богдан ИИ
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
              Ваш умный помощник с искусственным интеллектом
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 hover:border-indigo-500/50 transition-all">
                <div className="text-4xl mb-3">💬</div>
                <h3 className="font-semibold text-white mb-2">Общение</h3>
                <p className="text-sm text-gray-400">Задавайте вопросы, получайте умные ответы</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 hover:border-purple-500/50 transition-all">
                <div className="text-4xl mb-3">📝</div>
                <h3 className="font-semibold text-white mb-2">Создание текстов</h3>
                <p className="text-sm text-gray-400">Статьи, письма, посты для соцсетей</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 hover:border-cyan-500/50 transition-all">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-semibold text-white mb-2">Анализ данных</h3>
                <p className="text-sm text-gray-400">Обработка информации, выводы</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 hover:border-pink-500/50 transition-all">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="font-semibold text-white mb-2">Обучение</h3>
                <p className="text-sm text-gray-400">Объяснения, решение задач</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 hover:border-green-500/50 transition-all">
                <div className="text-4xl mb-3">💡</div>
                <h3 className="font-semibold text-white mb-2">Идеи и советы</h3>
                <p className="text-sm text-gray-400">Генерация идей, рекомендации</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 hover:border-yellow-500/50 transition-all">
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="font-semibold text-white mb-2">Переводы</h3>
                <p className="text-sm text-gray-400">Перевод на любые языки</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 hover:border-red-500/50 transition-all">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-semibold text-white mb-2">Резюме</h3>
                <p className="text-sm text-gray-400">Краткое изложение длинных текстов</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 hover:border-orange-500/50 transition-all">
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="font-semibold text-white mb-2">Креатив</h3>
                <p className="text-sm text-gray-400">Истории, стихи, сценарии</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">🚀 Начните прямо сейчас!</h2>
              <p className="text-lg text-indigo-100 mb-6">
                Нажмите на кнопку AI в правом нижнем углу и начните общение с искусственным интеллектом
              </p>
              {!aiChatSettings.enabled && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-white text-sm">
                    💡 Для активации перейдите в{' '}
                    <a href="/admin" className="text-cyan-300 hover:underline font-medium">админ-панель</a>
                    {' '}и добавьте API ключ
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
        <ContactButtons whatsapp={contactInfo.whatsapp} telegram={contactInfo.telegram} />
        {aiChatSettings.enabled && (
          <AIChatButton 
            apiKey={aiChatSettings.apiKey} 
            model={aiChatSettings.model}
          />
        )}
      </div>
    </div>
  );
}
