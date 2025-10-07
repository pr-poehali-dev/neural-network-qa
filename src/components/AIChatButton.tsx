import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import AIChatHeader from '@/components/chat/AIChatHeader';
import AIChatMessages, { Message } from '@/components/chat/AIChatMessages';
import AIChatInput from '@/components/chat/AIChatInput';
import AIChatStats from '@/components/chat/AIChatStats';

interface AIChatButtonProps {
  className?: string;
  apiKey?: string;
  model?: string;
}

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
        <AIChatHeader
          model={model}
          onExport={exportChat}
          onClear={clearHistory}
          onClose={() => setShowChat(false)}
        />

        <AIChatStats
          totalTokens={totalTokens}
          messageCount={messages.length}
        />

        <AIChatMessages
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          onCopyMessage={copyMessage}
          showQuickPrompts={showQuickPrompts}
          onQuickPrompt={handleQuickPrompt}
        />

        <AIChatInput
          input={input}
          isLoading={isLoading}
          uploadedFiles={uploadedFiles}
          fileInputRef={fileInputRef}
          onInputChange={setInput}
          onKeyPress={handleKeyPress}
          onSend={() => sendMessage()}
          onFileUpload={handleFileUpload}
          onRemoveFile={removeFile}
        />
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
