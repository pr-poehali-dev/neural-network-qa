import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import ChatHistoryPanel from '@/components/ChatHistoryPanel';
import ChatContainer from '@/components/ChatContainer';
import SuggestionsGrid from '@/components/SuggestionsGrid';
import FeaturesGrid from '@/components/FeaturesGrid';
import Footer from '@/components/Footer';
import AIToolsPanel from '@/components/AIToolsPanel';
import ExportMenu from '@/components/ExportMenu';
import PromptTemplates from '@/components/PromptTemplates';
import ApiKeyNotice from '@/components/ApiKeyNotice';

const AI_CHAT_URL = 'https://functions.poehali.dev/95328c78-94a6-4f98-a89c-a4b1b840ea99';
const CHAT_HISTORY_URL = 'https://functions.poehali.dev/824196a4-a71d-49e7-acbc-08d9f8801ff2';
const FILE_UPLOAD_URL = 'https://functions.poehali.dev/b58abb29-2429-4b6e-aed0-e5aae54d2240';

const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export default function Index() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string; file?: any; imageUrl?: string; isFavorite?: boolean }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ id: number; title: string; created_at: string; messages: Array<{ role: string; text: string }>; tags?: string[] }>>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [currentFileId, setCurrentFileId] = useState<number | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showApiNotice, setShowApiNotice] = useState(false);
  const { toast } = useToast();

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

  const toggleFavorite = (index: number) => {
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { ...msg, isFavorite: !msg.isFavorite } : msg
    ));
    toast({ 
      title: messages[index].isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное'
    });
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
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: data.response
        }]);
        
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZmMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>
      
      <div className="relative z-10">
        <Header 
          chatHistoryLength={chatHistory.length}
          onToggleHistory={() => setShowHistory(!showHistory)}
        />

        {showExportMenu && (
          <ExportMenu 
            messages={messages}
            onClose={() => setShowExportMenu(false)}
          />
        )}

        {showTemplates && (
          <PromptTemplates
            onSelectTemplate={(prompt) => {
              setInputMessage(prompt);
              setShowTemplates(false);
            }}
            onClose={() => setShowTemplates(false)}
          />
        )}

        {showApiNotice && (
          <ApiKeyNotice onClose={() => setShowApiNotice(false)} />
        )}

        <main className="container mx-auto px-6 py-12">
          <section className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Богдан
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Отвечает только на основе загруженных тобой данных
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
            
            <div className="mb-4 flex gap-2 justify-end">
              <Button
                onClick={() => setShowTemplates(true)}
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
              >
                <Icon name="BookmarkPlus" size={16} className="mr-2" />
                Шаблоны
              </Button>
            </div>

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
              onToggleFavorite={toggleFavorite}
            />

            <SuggestionsGrid onSelectSuggestion={setInputMessage} />

            <FeaturesGrid />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}