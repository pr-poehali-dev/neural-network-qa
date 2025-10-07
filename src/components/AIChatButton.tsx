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
}

interface AIChatButtonProps {
  className?: string;
  apiKey?: string;
  model?: string;
}

const QUICK_PROMPTS = [
  { emoji: '💡', text: 'Объясни простыми словами' },
  { emoji: '📝', text: 'Напиши статью про' },
  { emoji: '🔍', text: 'Проанализируй' },
  { emoji: '✨', text: 'Улучши текст' },
];

export default function AIChatButton({ 
  className = '',
  apiKey,
  model = 'deepseek/deepseek-chat'
}: AIChatButtonProps) {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [totalTokens, setTotalTokens] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;

    const storedApiKey = apiKey || localStorage.getItem('openrouter_api_key');
    
    if (!storedApiKey) {
      toast({
        title: 'API ключ не настроен',
        description: 'Настройте OpenRouter API ключ в админ-панели',
        variant: 'destructive'
      });
      return;
    }

    const userMessage: Message = { 
      role: 'user', 
      content: messageToSend,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
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
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
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
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось получить ответ',
        variant: 'destructive'
      });
      setMessages(prev => prev.slice(0, -1));
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
              <h3 className="font-semibold text-white">AI Ассистент</h3>
              <p className="text-xs text-white/80">{model.split('/')[1]}</p>
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
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              <Icon name="Bot" size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-2">Привет! Я AI-ассистент 👋</p>
              <p className="text-sm">Выберите команду или задайте свой вопрос</p>
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
          <div className="flex gap-2">
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
              disabled={isLoading || !input.trim()}
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