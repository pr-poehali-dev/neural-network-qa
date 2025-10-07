import { Message } from '@/components/chat/AIChatMessages';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface UseAIChatHandlersProps {
  apiKey?: string;
  model: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  uploadedFiles: {name: string; content: string; type: 'text' | 'image'; dataUrl?: string}[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<{name: string; content: string; type: 'text' | 'image'; dataUrl?: string}[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowQuickPrompts: React.Dispatch<React.SetStateAction<boolean>>;
  setTotalTokens: React.Dispatch<React.SetStateAction<number>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  imageInputRef: React.RefObject<HTMLInputElement>;
}

export function useAIChatHandlers({
  apiKey,
  model,
  messages,
  setMessages,
  input,
  setInput,
  uploadedFiles,
  setUploadedFiles,
  setIsLoading,
  setShowQuickPrompts,
  setTotalTokens,
  fileInputRef,
  imageInputRef
}: UseAIChatHandlersProps) {
  const { toast } = useToast();
  const { t } = useTranslation();

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
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          newFiles.push({ name: file.name, content: '', type: 'image', dataUrl });
        } else {
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

  const sendMessageViaGemini = async (userMessage: Message): Promise<Message> => {
    const savedSettings = localStorage.getItem('site_settings');
    const geminiApiKey = savedSettings ? JSON.parse(savedSettings).geminiApiKey : null;

    if (!geminiApiKey) {
      throw new Error('GEMINI_NOT_CONFIGURED');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [...messages, userMessage].map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }))
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Gemini API error');
    }

    const data = await response.json();
    return {
      role: 'assistant',
      content: data.candidates[0].content.parts[0].text,
      timestamp: Date.now()
    };
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
          throw new Error('RATE_LIMIT_429');
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
      
      if (errorMessage === 'RATE_LIMIT_429') {
        try {
          toast({
            title: `🔄 Переключение на Gemini...`,
            description: `OpenRouter перегружен, пробую Google Gemini API`,
          });

          const userMessage: Message = { 
            role: 'user', 
            content: messageToSend,
            timestamp: Date.now()
          };

          const geminiResponse = await sendMessageViaGemini(userMessage);
          setMessages(prev => [...prev, geminiResponse]);
          
          toast({
            title: `✅ Ответ получен через Gemini`,
            description: `OpenRouter недоступен, использовался резервный API`,
          });
          
          setIsLoading(false);
          return;
        } catch (geminiError) {
          const geminiErrorMsg = geminiError instanceof Error ? geminiError.message : 'Unknown error';
          
          if (geminiErrorMsg === 'GEMINI_NOT_CONFIGURED') {
            toast({
              title: `❌ Gemini API не настроен`,
              description: `Добавьте Gemini API ключ в настройках для автопереключения`,
              variant: 'destructive',
              duration: 10000
            });
            
            const errorMsg: Message = {
              role: 'assistant',
              content: `❌ **Превышен лимит запросов OpenRouter (429)**\n\n🔄 **Попытка переключения на Gemini провалилась**\n\nGemini API ключ не настроен.\n\n---\n\n📝 **Решения:**\n\n**Вариант 1: Добавить Gemini API ключ (рекомендуется)**\n1. Откройте [Google AI Studio](https://aistudio.google.com/apikey)\n2. Создайте API ключ\n3. Вставьте в **⚙️ Настройки** → **Google Gemini API Key**\n4. При ошибке 429 чат автоматически переключится на Gemini\n\n**Вариант 2: Подождать**\n- Подождите 1-2 минуты\n- Попробуйте снова\n\n**Вариант 3: Пополнить баланс**\n- Пополните $5 на [openrouter.ai](https://openrouter.ai)\n- Платные запросы без лимитов`,
              timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
            setIsLoading(false);
            return;
          }
          
          toast({
            title: `❌ Ошибка Gemini API`,
            description: geminiErrorMsg,
            variant: 'destructive',
            duration: 8000
          });
          
          const errorMsg: Message = {
            role: 'assistant',
            content: `❌ **OpenRouter перегружен (429)**\n❌ **Gemini тоже не сработал**\n\n**Ошибка Gemini:** ${geminiErrorMsg}\n\n---\n\n📝 **Решение:**\n1. Проверьте Gemini API ключ в настройках\n2. Или подождите 1-2 минуты\n3. Или пополните баланс на openrouter.ai`,
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, errorMsg]);
          setIsLoading(false);
          return;
        }
      }
      
      let helpText = '';
      if (errorMessage.includes('401') || errorMessage.includes('Invalid')) {
        helpText = '\n\n**Решение:** Проверьте API ключ в админ-панели (⚙️ → Настройки сайта)';
      } else if (errorMessage.includes('402') || errorMessage.includes('credits')) {
        helpText = '\n\n**Решение:** Пополните баланс на openrouter.ai или выберите бесплатную модель';
      } else if (errorMessage.includes('404') || errorMessage.includes('model')) {
        helpText = '\n\n**Решение:** Измените модель в админ-панели (⚙️ → Настройки сайта → Модель AI)';
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

  return {
    handleFileUpload,
    removeFile,
    sendMessage,
    clearHistory,
    copyMessage,
    exportChat
  };
}