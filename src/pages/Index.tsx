import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
    toast({
      title: "Файлы загружены",
      description: `Добавлено файлов: ${files.length}`,
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
      toast({
        title: "Файлы загружены",
        description: `Добавлено файлов: ${files.length}`,
      });
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: inputMessage }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Я проанализировал ваши данные. Что бы вы хотели узнать подробнее?' 
      }]);
    }, 1000);
    
    setInputMessage('');
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
                  AI Assistant
                </h1>
              </div>
              <nav className="hidden md:flex gap-8">
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">Главная</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">О сервисе</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">Контакты</a>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <section className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Умный анализ ваших данных
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Загрузите файлы и получите интеллектуальные ответы на любые вопросы по вашим данным
            </p>
          </section>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <Card 
              className={`p-8 border-2 transition-all duration-300 animate-slide-up ${
                isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-purple-200 hover:border-purple-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Icon name="Upload" className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Загрузите данные</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Перетащите файлы сюда или выберите с устройства
              </p>

              <div className="border-2 border-dashed border-purple-300 rounded-xl p-12 text-center mb-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
                <Icon name="FileUp" className="mx-auto mb-4 text-indigo-600" size={48} />
                <p className="text-gray-700 mb-4">Перетащите файлы или</p>
                <label>
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileInput}
                  />
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    Выбрать файлы
                  </Button>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900">Загруженные файлы ({uploadedFiles.length}):</p>
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
                      <Icon name="FileText" className="text-indigo-600" size={20} />
                      <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                      <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-purple-200">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Icon name="Network" className="text-indigo-600" size={28} />
                  </div>
                  <p className="text-sm text-gray-600">Анализ данных</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                    <Icon name="Upload" className="text-purple-600" size={28} />
                  </div>
                  <p className="text-sm text-gray-600">Загрузка</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-cyan-100 flex items-center justify-center">
                    <Icon name="Brain" className="text-cyan-600" size={28} />
                  </div>
                  <p className="text-sm text-gray-600">AI обработка</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2 border-purple-200 flex flex-col animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <Icon name="MessageSquare" className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">AI Чат</h3>
              </div>

              <div className="flex-1 bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-xl p-6 mb-6 overflow-y-auto min-h-[300px] max-h-[400px] space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-12">
                    <Icon name="Sparkles" className="mx-auto mb-4 text-purple-400" size={48} />
                    <p>Задайте вопрос по вашим данным</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                          : 'bg-white border border-purple-200 text-gray-900'
                      }`}>
                        {msg.role === 'ai' && (
                          <Icon name="Sparkles" className="inline mr-2 text-purple-600" size={16} />
                        )}
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-3">
                <Textarea 
                  placeholder="Спросите что-нибудь о ваших данных..." 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  className="resize-none border-purple-200 focus:border-indigo-500"
                  rows={3}
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6"
                >
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </Card>
          </div>

          <section className="mt-16 text-center">
            <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 border-0 text-white">
              <Icon name="Zap" className="mx-auto mb-6 text-cyan-200" size={56} />
              <h3 className="text-3xl font-bold mb-4">Готовы начать?</h3>
              <p className="text-xl text-indigo-100 mb-8">
                Загрузите свои данные и получите мгновенные AI-ответы
              </p>
              <Button 
                size="lg" 
                className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-8 py-6"
              >
                Попробовать бесплатно
              </Button>
            </Card>
          </section>
        </main>

        <footer className="border-t border-purple-200 mt-20 py-8 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 text-center text-gray-600">
            <p>© 2024 AI Assistant. Все права защищены.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
