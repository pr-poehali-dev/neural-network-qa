import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
  files?: {name: string; content: string}[];
}

interface AIChatButtonProps {
  className?: string;
  apiKey?: string;
  model?: string;
}

const QUICK_PROMPTS = [
  { emoji: '💡', text: 'Объясни простыми словами' },
  { emoji: '📝', text: 'Напиши текст про' },
  { emoji: '🔍', text: 'Проанализируй документ' },
  { emoji: '✨', text: 'Улучши и исправь' },
  { emoji: '📊', text: 'Сделай краткое резюме' },
  { emoji: '🌍', text: 'Переведи на' },
];

export default function AIChatButton({ 
  className = '',
  apiKey,
  model = 'google/gemini-2.0-flash-exp:free'
}: AIChatButtonProps) {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [totalTokens, setTotalTokens] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string; content: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem('ai_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: {name: string; content: string}[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Файл слишком большой',
          description: `${file.name} превышает 5 МБ`,
          variant: 'destructive'
        });
        continue;
      }

      try {
        const text = await file.text();
        newFiles.push({ name: file.name, content: text });
      } catch (error) {
        toast({
          title: 'Ошибка чтения файла',
          description: file.name,
          variant: 'destructive'
        });
      }
    }

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast({
        title: `Загружено файлов: ${newFiles.length}`,
        description: newFiles.map(f => f.name).join(', ')
      });
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast({ title: 'Файл удалён' });
  };

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim() && uploadedFiles.length === 0) return;

    const storedApiKey = apiKey || localStorage.getItem('openrouter_api_key');
    
    if (!storedApiKey) {
      toast({
        title: 'API ключ не настроен',
        description: 'Настройте OpenRouter API ключ в админ-панели',
        variant: 'destructive'
      });
      return;
    }

    let fullContent = messageToSend;
    if (uploadedFiles.length > 0) {
      fullContent += '\n\n📎 Прикреплённые документы:\n\n';
      uploadedFiles.forEach(file => {
        fullContent += `--- ${file.name} ---\n${file.content}\n\n`;
      });
    }

    const userMessage: Message = { 
      role: 'user', 
      content: fullContent,
      timestamp: Date.now(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedFiles([]);
    setIsLoading(true);
    setShowQuickPrompts(false);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Chat Assistant'
        },
        body: JSON.stringify({
          model: model,
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        let errorMsg = 'API request failed';
        try {
          const error = await response.json();
          errorMsg = error.error?.message || error.message || errorMsg;
        } catch (e) {
          errorMsg = `HTTP ${response.status}`;
        }
        
        if (response.status === 401) {
          throw new Error('API ключ недействителен. Получите новый на openrouter.ai/keys');
        }
        
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const aiResponse: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: Date.now()
      };

      if (data.usage) {
        setTotalTokens(prev => prev + (data.usage.total_tokens || 0));
      }

      setMessages(prev => [...prev, aiResponse]);
      
      toast({
        title: 'Ответ получен!',
        description: `Использовано токенов: ${data.usage?.total_tokens || 0}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось получить ответ';
      
      let userFriendlyMessage = errorMessage;
      let diagnosticTips = '';
      
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        userFriendlyMessage = 'API ключ недействителен';
        diagnosticTips = 'Проверьте ключ в админ-панели';
      } else if (errorMessage.includes('402') || errorMessage.includes('credits')) {
        userFriendlyMessage = 'Недостаточно средств';
        diagnosticTips = 'Пополните баланс на openrouter.ai';
      } else if (errorMessage.includes('404')) {
        userFriendlyMessage = 'Модель не найдена';
        diagnosticTips = 'Выберите другую модель в настройках';
      } else if (errorMessage.includes('429')) {
        userFriendlyMessage = 'Слишком много запросов';
        diagnosticTips = 'Подождите 30 секунд';
      } else if (errorMessage.includes('503')) {
        userFriendlyMessage = 'Модель временно недоступна';
        diagnosticTips = 'Попробуйте DeepSeek Chat или Llama 3';
      }
      
      toast({
        title: '❌ ' + userFriendlyMessage,
        description: diagnosticTips || 'Проверьте настройки в админ-панели',
        variant: 'destructive',
        duration: 5000
      });
      
      const errorMsg: Message = {
        role: 'assistant',
        content: `❌ ${userFriendlyMessage}\n\n💡 ${diagnosticTips || 'Проверьте настройки API ключа в админ-панели'}`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText + ' ');
    setShowQuickPrompts(false);
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('ai_chat_history');
    setTotalTokens(0);
    setShowQuickPrompts(true);
    toast({ title: 'История очищена' });
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Скопировано в буфер обмена' });
  };

  const exportChat = () => {
    const chatData = messages.map(m => `${m.role === 'user' ? 'Вы' : 'AI'}: ${m.content}`).join('\n\n');
    const blob = new Blob([chatData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${Date.now()}.txt`;
    a.click();
    toast({ title: 'Чат экспортирован' });
  };

  if (showChat) {
    return (
      <Card className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 shadow-2xl flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <h3 className="font-semibold text-white">Богдан ИИ</h3>
              <p className="text-xs text-white/80">Онлайн • {model.split('/')[1] || 'AI'}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={exportChat}
              title="Экспорт чата"
              className="hover:bg-white/20 text-white"
            >
              <Icon name="Download" size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearHistory}
              title="Очистить чат"
              className="hover:bg-white/20 text-white"
            >
              <Icon name="Trash2" size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowChat(false)}
              className="hover:bg-white/20 text-white"
            >
              <Icon name="X" size={18} />
            </Button>
          </div>
        </div>

        {/* Stats */}
        {totalTokens > 0 && (
          <div className="px-4 py-2 bg-blue-50 dark:bg-gray-900 border-b dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Icon name="Zap" size={12} />
                Токенов: {totalTokens}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="MessageSquare" size={12} />
                Сообщений: {messages.length}
              </span>
            </div>
          </div>
        )}

        {/* Quick Prompts */}
        {showQuickPrompts && messages.length === 0 && (
          <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Быстрые команды:</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt.text)}
                  className="justify-start text-xs hover:bg-white dark:hover:bg-gray-700"
                >
                  <span className="mr-1">{prompt.emoji}</span>
                  {prompt.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
              <Icon name="Bot" size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-2 text-lg">Привет! Я Богдан ИИ 👋</p>
              <p className="text-sm mb-4">Ваш умный помощник с искусственным интеллектом</p>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-left text-xs space-y-2 max-w-xs mx-auto">
                <p className="font-medium text-indigo-900 dark:text-indigo-100">Я могу помочь вам:</p>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                  <li>💬 Отвечать на вопросы</li>
                  <li>📝 Создавать тексты</li>
                  <li>📄 Анализировать документы</li>
                  <li>🌍 Переводить тексты</li>
                  <li>💡 Генерировать идеи</li>
                </ul>
                <p className="text-indigo-700 dark:text-indigo-300 font-medium pt-2 border-t border-indigo-200 dark:border-indigo-800">
                  📎 Прикрепите файл кнопкой внизу!
                </p>
              </div>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 relative ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Icon 
                    name={msg.role === 'user' ? 'User' : 'Bot'} 
                    size={16} 
                    className="mt-1 flex-shrink-0"
                  />
                  <div className="flex-1">
                    {msg.files && msg.files.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-1">
                        {msg.files.map((file, fileIdx) => (
                          <div key={fileIdx} className="bg-white/20 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                            <Icon name="FileText" size={10} />
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                    {msg.timestamp && (
                      <p className="text-xs opacity-60 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    )}
                  </div>
                </div>
                
                {msg.role === 'assistant' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyMessage(msg.content)}
                    className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Копировать"
                  >
                    <Icon name="Copy" size={14} />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center gap-2">
                <Icon name="Loader2" className="animate-spin text-indigo-600" size={20} />
                <span className="text-sm text-gray-600 dark:text-gray-400">AI печатает...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {uploadedFiles.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Icon name="FileText" size={12} />
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button
                    onClick={() => removeFile(idx)}
                    className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx,.md"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="dark:bg-gray-800 dark:border-gray-600"
              title="Загрузить документ"
            >
              <Icon name="Paperclip" size={18} />
            </Button>
            <Input
              placeholder="Напишите сообщение..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            />
            <Button 
              onClick={() => sendMessage()}
              disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isLoading ? (
                <Icon name="Loader2" className="animate-spin" size={18} />
              ) : (
                <Icon name="Send" size={18} />
              )}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Button
      onClick={() => setShowChat(true)}
      size="lg"
      className={`fixed bottom-6 right-6 z-40 rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-110 transition-transform ${className}`}
      title="Открыть AI-чат"
    >
      <Icon name="Bot" size={28} />
    </Button>
  );
}