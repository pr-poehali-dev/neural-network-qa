import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useHotkeys } from '@/hooks/useHotkeys';
import { useTranslation } from '@/hooks/useTranslation';
import AIChatHeader from '@/components/chat/AIChatHeader';
import AIChatMessages, { Message } from '@/components/chat/AIChatMessages';
import AIChatInput from '@/components/chat/AIChatInput';
import AIChatStats from '@/components/chat/AIChatStats';
import SpecialCommands from '@/components/chat/SpecialCommands';
import ApiKeySetupGuide from '@/components/ApiKeySetupGuide';

interface AIChatButtonProps {
  className?: string;
  apiKey?: string;
  model?: string;
  embedded?: boolean;
  isAdmin?: boolean;
}

export default function AIChatButton({ 
  className = '',
  apiKey,
  model = 'google/gemini-2.0-flash-exp:free',
  embedded = false,
  isAdmin = false
}: AIChatButtonProps) {
  const [showChat, setShowChat] = useState(embedded);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [showSpecialCommands, setShowSpecialCommands] = useState(false);
  const [totalTokens, setTotalTokens] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string; content: string; type: 'text' | 'image'; dataUrl?: string}[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Горячие клавиши
  useHotkeys([
    {
      key: 'k',
      ctrl: true,
      callback: () => {
        if (!embedded) {
          setShowChat(!showChat);
          toast({ 
            title: showChat ? t.notifications.chatClosed : t.notifications.chatOpened, 
            description: t.notifications.toggleHotkey 
          });
        }
      }
    },
    {
      key: 'Escape',
      callback: () => {
        if (isFullscreen) {
          setIsFullscreen(false);
          toast({ 
            title: t.notifications.exitFullscreen, 
            description: t.notifications.fullscreenHint 
          });
        } else if (showChat && !embedded) {
          setShowChat(false);
        }
      }
    },
    {
      key: 'F11',
      callback: () => {
        if (showChat) {
          setIsFullscreen(!isFullscreen);
          toast({ 
            title: isFullscreen ? t.notifications.normalMode : t.notifications.fullscreenMode, 
            description: t.notifications.escToExit 
          });
        }
      }
    }
  ]);

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
    } else {
      // Приветственное сообщение при первом открытии
      const hasApiKey = apiKey || localStorage.getItem('openrouter_api_key');
      const welcomeMsg: Message = {
        role: 'assistant',
        content: hasApiKey 
          ? `👋 **Добро пожаловать в AI чат!**\n\nЯ готов помочь вам с любыми вопросами. Вы можете:\n\n• Задавать вопросы на любые темы\n• Прикреплять файлы и изображения\n• Использовать голосовой ввод\n• Переводить тексты\n• Генерировать контент\n\nПросто напишите ваш вопрос! 💬`
          : `👋 **Добро пожаловать!**\n\n⚠️ **Для работы чата нужно настроить API ключ:**\n\n1. Нажмите **⚙️ Настройки** в верхней панели\n2. Введите пароль: **bogdan2025**\n3. Перейдите в **"Настройки сайта"**\n4. Прокрутите до **"Настройки AI чат-бота"**\n5. Получите бесплатный ключ на [openrouter.ai/keys](https://openrouter.ai/keys)\n6. Вставьте ключ и сохраните\n\n✅ После этого чат заработает!`,
        timestamp: Date.now()
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'text' | 'image') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: {name: string; content: string; type: 'text' | 'image'; dataUrl?: string}[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t.errors.fileTooLarge,
          description: `${file.name} ${t.errors.fileExceeds}`,
          variant: 'destructive'
        });
        continue;
      }

      try {
        if (type === 'image') {
          // Для изображений создаём base64 data URL
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          newFiles.push({ name: file.name, content: '', type: 'image', dataUrl });
        } else {
          // Для текстовых файлов читаем текст
          const text = await file.text();
          newFiles.push({ name: file.name, content: text, type: 'text' });
        }
      } catch (error) {
        toast({
          title: t.errors.fileReadError,
          description: file.name,
          variant: 'destructive'
        });
      }
    }

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast({
        title: `${t.errors.filesUploaded}: ${newFiles.length}`,
        description: newFiles.map(f => f.name).join(', ')
      });
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast({ title: t.errors.fileRemoved });
  };

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim() && uploadedFiles.length === 0) return;

    const storedApiKey = apiKey || localStorage.getItem('openrouter_api_key');
    
    if (!storedApiKey) {
      const errorMsg: Message = {
        role: 'assistant',
        content: `❌ **API ключ не настроен**\n\n📝 **Как исправить:**\n\n1. Нажмите кнопку **⚙️ Настройки** в верхней панели\n2. Введите пароль: **bogdan2025**\n3. Перейдите в раздел **"Настройки сайта"**\n4. Прокрутите вниз до **"Настройки AI чат-бота"**\n5. Вставьте **OpenRouter API ключ**\n   - Получить бесплатно: [openrouter.ai/keys](https://openrouter.ai/keys)\n6. Нажмите **"Сохранить настройки"**\n\n💡 После настройки чат будет работать!`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
      
      toast({
        title: `❌ API ключ не настроен`,
        description: `Зайдите в админ-панель (⚙️) → Настройки сайта`,
        variant: 'destructive',
        duration: 8000
      });
      return;
    }

    const textFiles = uploadedFiles.filter(f => f.type === 'text');
    const imageFiles = uploadedFiles.filter(f => f.type === 'image');
    
    let fullContent = messageToSend;
    if (textFiles.length > 0) {
      fullContent += '\n\n📎 Прикреплённые документы:\n\n';
      textFiles.forEach(file => {
        fullContent += `--- ${file.name} ---\n${file.content}\n\n`;
      });
    }
    
    if (imageFiles.length > 0) {
      fullContent += `\n\n🖼️ Прикреплено изображений: ${imageFiles.length}\n`;
      imageFiles.forEach(file => {
        fullContent += `📷 ${file.name}\n`;
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
          messages: [...messages, userMessage].map(m => {
            // Для сообщений с изображениями используем multimodal формат
            if (m.files && m.files.some(f => f.type === 'image')) {
              const content: any[] = [{ type: 'text', text: m.content }];
              m.files.filter(f => f.type === 'image' && f.dataUrl).forEach(img => {
                content.push({
                  type: 'image_url',
                  image_url: { url: img.dataUrl }
                });
              });
              return { role: m.role, content };
            }
            return { role: m.role, content: m.content };
          })
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
          throw new Error(t.errors.invalidApiKey);
        }
        
        if (response.status === 402) {
          throw new Error(t.errors.insufficientCredits);
        }
        
        if (response.status === 404) {
          throw new Error(t.errors.modelNotFound);
        }
        
        if (response.status === 429) {
          throw new Error('Превышен лимит запросов. Попробуйте через 1 минуту или выберите другую модель.');
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
        title: `✓ ${t.errors.responseReceived}`,
        description: `${t.errors.tokensUsed}: ${data.usage?.total_tokens || 0}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t.errors.failedToGetResponse;
      
      let helpText = '';
      if (errorMessage.includes('401') || errorMessage.includes('Invalid')) {
        helpText = '\n\n**Решение:** Проверьте API ключ в админ-панели (⚙️ → Настройки сайта)';
      } else if (errorMessage.includes('402') || errorMessage.includes('credits')) {
        helpText = '\n\n**Решение:** Пополните баланс на openrouter.ai или выберите бесплатную модель';
      } else if (errorMessage.includes('404') || errorMessage.includes('model')) {
        helpText = '\n\n**Решение:** Измените модель в админ-панели (⚙️ → Настройки сайта → Модель AI)';
      } else if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        helpText = '\n\n**Решение:** Превышен лимит запросов. Подождите 1 минуту или выберите другую модель';
      } else {
        helpText = '\n\n**Решение:** Проверьте интернет-соединение и API ключ';
      }
      
      toast({
        title: `❌ Ошибка API`,
        description: errorMessage,
        variant: 'destructive',
        duration: 8000
      });
      
      const errorMsg: Message = {
        role: 'assistant',
        content: `❌ **Ошибка подключения к AI**\n\n**Детали:** ${errorMessage}${helpText}\n\n---\n\n📝 **Инструкция по настройке:**\n1. Нажмите **⚙️ Настройки** → введите пароль **bogdan2025**\n2. Прокрутите до **"Настройки AI чат-бота"**\n3. Вставьте корректный **OpenRouter API ключ**\n4. Выберите **бесплатную модель** (Google Gemini 2.0 Flash)\n5. Сохраните настройки`,
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

  const handleSpecialCommand = (prompt: string) => {
    setInput(prompt);
    setShowSpecialCommands(false);
    setShowQuickPrompts(false);
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('ai_chat_history');
    setTotalTokens(0);
    setShowQuickPrompts(true);
    toast({ title: t.notifications.historyCleared });
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: t.notifications.messageCopied });
  };

  const exportChat = () => {
    const chatData = messages.map(m => `${m.role === 'user' ? 'Вы' : 'AI'}: ${m.content}`).join('\n\n');
    const blob = new Blob([chatData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${Date.now()}.txt`;
    a.click();
    toast({ title: t.notifications.chatExported });
  };

  if (showChat) {
    const containerClass = embedded 
      ? "w-full h-full bg-white dark:bg-gray-800 flex flex-col"
      : isFullscreen
        ? "fixed inset-0 z-[100] bg-white dark:bg-gray-800 flex flex-col"
        : "fixed bottom-6 right-6 z-50 w-96 bg-white dark:bg-gray-800 shadow-2xl flex flex-col animate-scale-in rounded-xl overflow-hidden h-[85vh] min-h-[700px] max-h-[900px]";

    return (
      <Card className={containerClass}>
        <AIChatHeader
          model={model}
          onExport={exportChat}
          onClear={clearHistory}
          onClose={embedded ? undefined : () => setShowChat(false)}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          isFullscreen={isFullscreen}
          onQuickPrompt={handleQuickPrompt}
        />

        <AIChatStats
          totalTokens={totalTokens}
          messageCount={messages.length}
        />

        {!apiKey && !localStorage.getItem('openrouter_api_key') && (
          <ApiKeySetupGuide onOpenSettings={() => {
            if (!embedded) {
              setShowChat(false);
            }
            setTimeout(() => {
              const settingsBtn = document.querySelector('[data-settings-btn]') as HTMLElement;
              if (settingsBtn) {
                settingsBtn.click();
              } else {
                window.location.href = '/admin';
              }
            }, 100);
          }} />
        )}

        {showSpecialCommands ? (
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white">{t.chat.specialFunctions}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowSpecialCommands(false)}
                className="text-white hover:bg-white/10"
              >
                <Icon name="X" size={18} />
              </Button>
            </div>
            <SpecialCommands onSelectCommand={handleSpecialCommand} />
          </div>
        ) : (
          <AIChatMessages
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
            onCopyMessage={copyMessage}
            showQuickPrompts={showQuickPrompts}
            onQuickPrompt={handleQuickPrompt}
          />
        )}

        <div className="border-t dark:border-gray-700">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSpecialCommands(!showSpecialCommands)}
              className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
            >
              <Icon name="Wand2" size={16} className="mr-2" />
              {showSpecialCommands ? t.chat.backToChat : t.chat.specialFunctions}
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-400 hidden sm:flex items-center gap-1">
                <Icon name="Keyboard" size={10} />
                {t.chat.hotkey}
              </span>
              <span className="text-xs text-gray-500">30+ {t.chat.commands}</span>
            </div>
          </div>
          
          <AIChatInput
            input={input}
            isLoading={isLoading}
            uploadedFiles={uploadedFiles}
            fileInputRef={fileInputRef}
            imageInputRef={imageInputRef}
            onInputChange={setInput}
            onKeyPress={handleKeyPress}
            onSend={() => sendMessage()}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            isAdmin={isAdmin}
          />
        </div>
      </Card>
    );
  }

  if (embedded) return null;

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