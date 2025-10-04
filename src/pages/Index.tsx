import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

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
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string; file?: any }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ id: string; title: string; messages: Array<{ role: 'user' | 'ai'; text: string }> }>>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentFileId, setCurrentFileId] = useState<number | null>(null);
  const { toast } = useToast();

  const saveChat = async () => {
    if (messages.length === 0) return;
    
    try {
      const sessionId = getSessionId();
      const title = messages[0]?.text.substring(0, 50) || 'Новый чат';
      
      await fetch(CHAT_HISTORY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, title, messages })
      });
      
      toast({ title: 'Чат сохранен' });
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const clearChat = async () => {
    await saveChat();
    setMessages([]);
    setCurrentChatId(null);
    setUploadedFile(null);
    setCurrentFileId(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      
      try {
        const response = await fetch(FILE_UPLOAD_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            fileType: file.type,
            fileSize: file.size,
            content: content,
            sessionId: getSessionId()
          })
        });
        
        const data = await response.json();
        
        if (data.file_id) {
          setCurrentFileId(data.file_id);
          toast({ title: `Файл "${file.name}" загружен и готов к анализу` });
          setMessages(prev => [...prev, { 
            role: 'user', 
            text: `📎 Загружен файл: ${file.name}`,
            file: { name: file.name, type: file.type, size: file.size, id: data.file_id }
          }]);
        }
      } catch (error) {
        toast({ title: 'Ошибка загрузки файла', variant: 'destructive' });
      }
    };
    
    reader.readAsText(file);
  };

  const exportChat = () => {
    const chatText = messages.map(m => `${m.role === 'user' ? 'Пользователь' : 'AI'}: ${m.text}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `чат-${Date.now()}.txt`;
    a.click();
    toast({ title: 'Чат экспортирован' });
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
        const responseText = data.file_analyzed 
          ? `${data.response}`
          : data.response;
          
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: responseText
        }]);
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
        <header className="border-b border-white/20 backdrop-blur-md bg-white/30">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Icon name="Brain" className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Богдан AI
                </h1>
              </div>
              <nav className="flex gap-6 items-center">
                <a href="/" className="text-indigo-600 font-medium">Главная</a>
                <a href="/about" className="text-gray-700 hover:text-indigo-600 transition-colors">О сервисе</a>
                <a href="/admin" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  <Icon name="Shield" className="inline mr-1" size={16} />
                  Админ
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <section className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Богдан AI
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Твой умный помощник с суперспособностями
            </p>
          </section>

          <div className="max-w-5xl mx-auto">
            <Card className="p-8 border-2 border-purple-200 flex flex-col animate-slide-up min-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                    <Icon name="MessageSquare" className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Чат</h3>
                </div>
                <div className="flex gap-2">
                  {messages.length > 0 && (
                    <>
                      <Button variant="outline" size="sm" onClick={saveChat}>
                        <Icon name="Save" className="mr-2" size={16} />
                        Сохранить
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportChat}>
                        <Icon name="Download" className="mr-2" size={16} />
                        Экспорт
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearChat}>
                        <Icon name="Plus" className="mr-2" size={16} />
                        Новый
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1 bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-xl p-6 mb-6 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-32">
                    <Icon name="Sparkles" className="mx-auto mb-6 text-purple-400" size={64} />
                    <h4 className="text-2xl font-bold text-gray-700 mb-3">Начните диалог</h4>
                    <p className="text-lg">Задайте любой вопрос</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                          : 'bg-white border border-purple-200 text-gray-900 shadow-sm'
                      }`}>
                        {msg.role === 'ai' && (
                          <Icon name="Sparkles" className="inline mr-2 text-purple-600" size={18} />
                        )}
                        <span className="text-base">{msg.text}</span>
                        {msg.file && (
                          <div className="mt-2 pt-2 border-t border-white/20">
                            <Icon name="FileText" className="inline mr-1" size={14} />
                            <span className="text-xs opacity-80">{msg.file.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3">
                {uploadedFile && currentFileId && (
                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <Icon name="CheckCircle" className="text-green-600" size={20} />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-green-900">{uploadedFile.name}</span>
                      <p className="text-xs text-green-700">Готов к анализу. Задайте вопрос о файле!</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { setUploadedFile(null); setCurrentFileId(null); }}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                )}
                
                <div className="flex gap-3 relative">
                  <div className="flex-1 relative">
                    <Textarea 
                      placeholder="Задайте любой вопрос..." 
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                      className="resize-none border-purple-200 focus:border-indigo-500 text-base pr-4"
                      rows={3}
                      disabled={isLoading}
                    />
                    <label className="absolute bottom-3 right-3 cursor-pointer">
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        accept=".txt,.pdf,.doc,.docx,.json"
                      />
                      <Icon name="Paperclip" className="text-gray-400 hover:text-indigo-600 transition-colors" size={20} />
                    </label>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 shadow-lg"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Icon name="Loader2" size={22} className="animate-spin" />
                    ) : (
                      <Icon name="Send" size={22} />
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-4 gap-6 mt-12">
              <Card className="p-6 border-2 border-purple-200 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Icon name="Zap" className="text-indigo-600" size={32} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Быстрые ответы</h4>
                <p className="text-sm text-gray-600">Мгновенный анализ и результаты</p>
              </Card>

              <Card className="p-6 border-2 border-purple-200 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <Icon name="Brain" className="text-purple-600" size={32} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Умный анализ</h4>
                <p className="text-sm text-gray-600">AI понимает контекст вопросов</p>
              </Card>

              <Card className="p-6 border-2 border-purple-200 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon name="FileText" className="text-green-600" size={32} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Работа с файлами</h4>
                <p className="text-sm text-gray-600">Загружай и анализируй документы</p>
              </Card>

              <Card className="p-6 border-2 border-purple-200 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Icon name="Shield" className="text-cyan-600" size={32} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Безопасность</h4>
                <p className="text-sm text-gray-600">Данные защищены и приватны</p>
              </Card>
            </div>
          </div>
        </main>

        <footer className="border-t border-purple-200 mt-20 py-12 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Icon name="Brain" className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Богдан AI</p>
                  <p className="text-sm text-gray-600">Умный помощник нового поколения</p>
                </div>
              </div>
              <div className="flex gap-8">
                <a href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Главная</a>
                <a href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">О сервисе</a>
                <a href="/admin" className="text-gray-600 hover:text-indigo-600 transition-colors">Админ</a>
              </div>
            </div>
            <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t border-purple-100">
              © 2024 Богдан AI. Все права защищены.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}