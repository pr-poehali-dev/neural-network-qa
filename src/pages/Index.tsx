import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import ChatHistoryPanel from '@/components/ChatHistoryPanel';
import ChatContainer from '@/components/ChatContainer';


import Footer from '@/components/Footer';
import AIToolsPanel from '@/components/AIToolsPanel';
import ExportDialog from '@/components/ExportDialog';
import ReadingModePanel from '@/components/ReadingModePanel';
import ApiKeyNotice from '@/components/ApiKeyNotice';
import SettingsPanel from '@/components/SettingsPanel';
import { useLanguage } from '@/contexts/LanguageContext';

const AI_CHAT_URL = 'https://functions.poehali.dev/95328c78-94a6-4f98-a89c-a4b1b840ea99';
const CHAT_HISTORY_URL = 'https://functions.poehali.dev/824196a4-a71d-49e7-acbc-08d9f8801ff2';

const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export default function Index() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string; file?: any; imageUrl?: string; images?: Array<{name: string; base64: string; mimeType: string}>; isFavorite?: boolean }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ id: number; title: string; created_at: string; messages: Array<{ role: string; text: string }>; tags?: string[] }>>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [currentFileId, setCurrentFileId] = useState<number | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showReadingMode, setShowReadingMode] = useState(false);
  const [showApiNotice, setShowApiNotice] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const { toast } = useToast();
  const { t } = useLanguage();

  const loadChatHistory = async () => {
    try {
      const sessionId = getSessionId();
      const response = await fetch(`${CHAT_HISTORY_URL}?session_id=${sessionId}`);
      const data = await response.json();
      
      if (data.chats) {
        setChatHistory(data.chats);
      }
    } catch (error) {
      console.error('Load history error:', error);
    }
  };

  const saveChat = async () => {
    if (messages.length === 0) return;
    
    try {
      const sessionId = getSessionId();
      const title = messages[0]?.text.substring(0, 50) || 'Новый чат';
      
      const response = await fetch(CHAT_HISTORY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, title, messages })
      });
      
      const data = await response.json();
      
      if (data.chat_id) {
        setCurrentChatId(data.chat_id);
      }
      
      await loadChatHistory();
      toast({ title: 'Чат сохранен' });
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const loadChat = (chat: any) => {
    setMessages(chat.messages.map((m: any) => ({ role: m.role, text: m.text })));
    setCurrentChatId(chat.id);
    setShowHistory(false);
    toast({ title: `Загружен чат: ${chat.title}` });
  };

  const deleteChat = async (chatId: number) => {
    try {
      await fetch(`${CHAT_HISTORY_URL}?chat_id=${chatId}`, {
        method: 'DELETE'
      });
      
      await loadChatHistory();
      toast({ title: 'Чат удалён' });
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const updateChatTags = async (chatId: number, tags: string[]) => {
    try {
      await fetch(CHAT_HISTORY_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, tags })
      });
      
      await loadChatHistory();
      toast({ title: 'Теги обновлены' });
    } catch (error) {
      console.error('Update tags error:', error);
    }
  };

  const handleToolSelect = (toolPrompt: string) => {
    setInputMessage(toolPrompt);
    toast({ 
      title: 'Инструмент выбран',
      description: 'Допиши свой текст и отправь сообщение'
    });
  };

  useEffect(() => {
    loadChatHistory();
    
    // Load welcome message from settings
    const savedSettings = localStorage.getItem('site_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      const welcome = settings.welcomeMessage || 'Привет! 👋 Я помощник Богдан. Задавайте мне вопросы, и я отвечу на основе загруженных документов.';
      setWelcomeMessage(welcome);
      
      // Show welcome message only if no messages
      if (messages.length === 0 && !sessionStorage.getItem('welcome_shown')) {
        setMessages([{ role: 'ai', text: welcome }]);
        sessionStorage.setItem('welcome_shown', 'true');
      }
    }
  }, []);

  const clearChat = async () => {
    await saveChat();
    setMessages([]);
    setCurrentChatId(null);
    setCurrentFileId(null);
  };

  const exportChat = () => {
    setShowExportMenu(true);
  };



  const handleGenerateImage = async () => {
    if (!inputMessage.trim() || isLoading || isGeneratingImage) return;
    
    const userMsg = inputMessage;
    setMessages(prev => [...prev, { role: 'user', text: `🎨 Нарисуй: ${userMsg}` }]);
    setInputMessage('');
    setIsGeneratingImage(true);
    
    try {
      const response = await fetch(AI_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, generate_image: true })
      });
      
      const data = await response.json();
      
      if (data.image_url) {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: data.response,
          imageUrl: data.image_url
        }]);
      } else {
        throw new Error('No image generated');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать изображение",
        variant: "destructive"
      });
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Извините, не удалось создать изображение.' 
      }]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMsg = inputMessage;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const requestBody: any = { message: userMsg };
      
      if (currentFileId) {
        requestBody.file_id = currentFileId;
      }
      
      const response = await fetch(AI_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (data.response) {
        const aiText = data.response;
        const aiImages = data.images || [];
        
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: '',
          images: aiImages
        }]);
        
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
          if (currentIndex < aiText.length) {
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: 'ai',
                text: aiText.substring(0, currentIndex + 1),
                images: aiImages
              };
              return newMessages;
            });
            currentIndex++;
          } else {
            clearInterval(typingInterval);
          }
        }, 20);
        
        if (data.demo) {
          setShowApiNotice(true);
        }
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить ответ от AI",
        variant: "destructive"
      });
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Извините, произошла ошибка. Попробуйте позже.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZmMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>
      
      <div className="relative z-10">
        <Header 
          chatHistoryLength={chatHistory.length}
          onToggleHistory={() => setShowHistory(!showHistory)}
          onOpenSettings={() => setShowSettings(true)}
        />

        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}

        {showExportMenu && (
          <ExportDialog 
            messages={messages}
            onClose={() => setShowExportMenu(false)}
          />
        )}

        {showReadingMode && (
          <ReadingModePanel
            messages={messages}
            onClose={() => setShowReadingMode(false)}
          />
        )}



        {showApiNotice && (
          <ApiKeyNotice onClose={() => setShowApiNotice(false)} />
        )}

        <main className="container mx-auto px-6 py-12">
          <section className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              {t('main.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('main.subtitle')}
            </p>
          </section>

          <div className="max-w-5xl mx-auto relative">
            {showHistory && (
              <ChatHistoryPanel
                chatHistory={chatHistory}
                onClose={() => setShowHistory(false)}
                onLoadChat={loadChat}
                onDeleteChat={deleteChat}
                onUpdateTags={updateChatTags}
              />
            )}

            <ChatContainer
              messages={messages}
              inputMessage={inputMessage}
              isLoading={isLoading}
              isGeneratingImage={isGeneratingImage}
              onInputChange={setInputMessage}
              onSendMessage={handleSendMessage}
              onGenerateImage={handleGenerateImage}
              onSaveChat={saveChat}
              onExportChat={exportChat}
              onClearChat={clearChat}
              onOpenReadingMode={() => setShowReadingMode(true)}
              onAddMessage={(msg) => setMessages(prev => [...prev, msg])}
            />




          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}