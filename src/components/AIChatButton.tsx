import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatButtonProps {
  className?: string;
  apiKey?: string;
  model?: string;
}

export default function AIChatButton({ 
  className = '',
  apiKey,
  model = 'openai/gpt-3.5-turbo'
}: AIChatButtonProps) {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const storedApiKey = apiKey || localStorage.getItem('openrouter_api_key');
    
    if (!storedApiKey) {
      toast({
        title: 'API ключ не настроен',
        description: 'Настройте OpenRouter API ключ в админ-панели',
        variant: 'destructive'
      });
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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
        content: data.choices[0].message.content
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось получить ответ',
        variant: 'destructive'
      });
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

  if (showChat) {
    return (
      <Card className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 shadow-2xl flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              AI Ассистент
            </h3>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMessages([])}
              title="Очистить чат"
            >
              <Icon name="Trash2" size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
              <Icon name="X" size={18} />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              <Icon name="Bot" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Задайте вопрос AI ассистенту</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
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
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <Icon name="Loader2" className="animate-spin text-gray-600 dark:text-gray-400" size={20} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex gap-2">
            <Input
              placeholder="Напишите сообщение..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="dark:bg-gray-900 dark:text-white"
            />
            <Button 
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Icon name="Send" size={18} />
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
      className={`fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 ${className}`}
    >
      <Icon name="Bot" size={24} />
    </Button>
  );
}
