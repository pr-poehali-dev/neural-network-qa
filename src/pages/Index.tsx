import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import ContactButtons from '@/components/ContactButtons';
import AIChatButton from '@/components/AIChatButton';

export default function Index() {
  const [contactInfo, setContactInfo] = useState<{whatsapp?: string; telegram?: string}>({});
  const [aiChatSettings, setAiChatSettings] = useState<{enabled: boolean; apiKey?: string; model?: string}>({ enabled: false });
  const [diagnostic, setDiagnostic] = useState<{status: 'idle' | 'checking' | 'success' | 'error'; message?: string}>({ status: 'idle' });

  useEffect(() => {
    const savedSettings = localStorage.getItem('site_settings');
    console.log('🔍 Загружаю настройки:', savedSettings);
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        
        if (settings.aiModel === 'deepseek/deepseek-r1' || settings.aiModel === 'deepseek/deepseek-r1:free') {
          console.warn('🔧 Автомиграция: меняю недоступную модель R1 → Chat');
          settings.aiModel = 'deepseek/deepseek-chat';
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
            model: settings.aiModel || 'deepseek/deepseek-chat'
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

  const enableAIChatNow = async () => {
    setDiagnostic({ status: 'checking', message: 'Проверяю API ключ...' });
    
    const apiKey = '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';
    const model = 'deepseek/deepseek-chat';
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Chat Test'
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: 'Привет!' }],
          max_tokens: 10
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `HTTP ${response.status}`);
      }
      
      const settings = {
        enableAiChat: true,
        openrouterApiKey: apiKey,
        aiModel: model
      };
      localStorage.setItem('site_settings', JSON.stringify(settings));
      console.log('💾 Сохранил настройки:', settings);
      setAiChatSettings({
        enabled: true,
        apiKey: apiKey,
        model: model
      });
      setDiagnostic({ status: 'success', message: '✅ API работает! Чат включён' });
    } catch (error) {
      console.error('Диагностика провалена:', error);
      setDiagnostic({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Ошибка подключения к API'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZmMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>
      
      <div className="relative z-10">
        <main className="container mx-auto px-6 py-20">
          <section className="text-center mb-12 animate-fade-in">
            <div className="mb-8">
              <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-6">
                <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              AI Ассистент
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Умный помощник, работающий на OpenRouter
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg min-w-[200px]">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">6 моделей AI</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">GPT-4, Claude, Llama</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg min-w-[200px]">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Быстрые ответы</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">От 1 секунды</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg min-w-[200px]">
                <div className="text-3xl mb-2">💾</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">История чатов</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Автосохранение</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Как начать?</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Настройте API ключ</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Перейдите в{' '}
                      <a href="/admin" className="text-indigo-600 hover:underline font-medium">админ-панель</a>
                      {' '}→ Настройки сайта → AI чат-бот
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Получите ключ OpenRouter</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Зарегистрируйтесь на{' '}
                      <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">
                        openrouter.ai/keys
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Начните общаться!</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Нажмите на кнопку AI справа внизу экрана
                    </p>
                  </div>
                </div>
              </div>

              {!aiChatSettings.enabled && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    AI чат не настроен. Перейдите в админ-панель для настройки.
                  </p>
                  
                  {diagnostic.status === 'checking' && (
                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm text-blue-800 dark:text-blue-200">{diagnostic.message}</span>
                    </div>
                  )}
                  
                  {diagnostic.status === 'success' && (
                    <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-green-800 dark:text-green-200 font-medium">{diagnostic.message}</span>
                    </div>
                  )}
                  
                  {diagnostic.status === 'error' && (
                    <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-1">Ошибка подключения:</p>
                          <p className="text-xs text-red-700 dark:text-red-300">{diagnostic.message}</p>
                          <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                            <p className="font-medium mb-1">Возможные причины:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                              <li>API ключ недействителен или истёк</li>
                              <li>Нет средств на балансе OpenRouter</li>
                              <li>Модель временно недоступна</li>
                              <li>Проблемы с интернет-соединением</li>
                            </ul>
                            <a 
                              href="https://openrouter.ai/keys" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-block mt-2 text-red-700 dark:text-red-300 underline hover:text-red-900"
                            >
                              Проверить ключ на OpenRouter →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={enableAIChatNow}
                    disabled={diagnostic.status === 'checking'}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {diagnostic.status === 'checking' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Проверяю API...
                      </span>
                    ) : diagnostic.status === 'success' ? (
                      '✅ Чат включён! Обновите страницу'
                    ) : (
                      '🚀 Включить AI чат с проверкой (DeepSeek Chat)'
                    )}
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>

        <ContactButtons 
          whatsapp={contactInfo.whatsapp}
          telegram={contactInfo.telegram}
        />
        
        {aiChatSettings.enabled && (
          <AIChatButton 
            apiKey={aiChatSettings.apiKey}
            model={aiChatSettings.model}
          />
        )}
        
        <Footer />
      </div>
    </div>
  );
}