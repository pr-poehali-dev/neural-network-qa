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

  const sendMessageViaFallback = async (userMessage: Message, storedApiKey: string): Promise<Message> => {
    const savedSettings = localStorage.getItem('site_settings');
    const fallbackModel = savedSettings ? JSON.parse(savedSettings).fallbackAiModel : 'meta-llama/llama-3.3-70b-instruct:free';

    if (!fallbackModel) {
      throw new Error('FALLBACK_NOT_CONFIGURED');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${storedApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Chat Assistant'
      },
      body: JSON.stringify({
        model: fallbackModel,
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
      const error = await response.json();
      throw new Error(error.error?.message || 'Fallback API error');
    }

    const data = await response.json();
    return {
      role: 'assistant',
      content: data.choices[0].message.content,
      timestamp: Date.now()
    };
  };

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim() && uploadedFiles.length === 0) return;

    const savedSettings = localStorage.getItem('site_settings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {};
    const storedApiKey = apiKey || settings.openrouterApiKey || localStorage.getItem('openrouter_api_key');
    const storedApiKey2 = settings.openrouterApiKey2;
    
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t.errors.failedToGetResponse;
      
      if (errorMessage === 'RATE_LIMIT_429') {
        if (storedApiKey2) {
          try {
            toast({
              title: `🔄 Переключение на API ключ #2...`,
              description: `Основной ключ исчерпал лимит`,
            });

            const userMessage: Message = { 
              role: 'user', 
              content: messageToSend,
              timestamp: Date.now()
            };

            const fallbackResponse = await sendMessageViaFallback(userMessage, storedApiKey2);
            setMessages(prev => [...prev, fallbackResponse]);
            
            toast({
              title: `✅ Ответ получен через API ключ #2`,
              description: `Резервный ключ сработал успешно`,
            });
            
            setIsLoading(false);
            return;
          } catch (key2Error) {
            toast({
              title: `⚠️ API ключ #2 тоже недоступен`,
              description: `Пробую резервную модель...`,
            });
          }
        }

        try {
          const fallbackModel = settings.fallbackAiModel || 'meta-llama/llama-3.3-70b-instruct:free';
          
          toast({
            title: `🔄 Переключение на резервную модель...`,
            description: `Основная модель перегружена, пробую ${fallbackModel}`,
          });

          const userMessage: Message = { 
            role: 'user', 
            content: messageToSend,
            timestamp: Date.now()
          };

          const fallbackResponse = await sendMessageViaFallback(userMessage, storedApiKey!);
          setMessages(prev => [...prev, fallbackResponse]);
          
          toast({
            title: `✅ Ответ получен через резервную модель`,
            description: `Использована модель: ${fallbackModel}`,
          });
          
          setIsLoading(false);
          return;
        } catch (fallbackError) {
          const fallbackErrorMsg = fallbackError instanceof Error ? fallbackError.message : 'Unknown error';
          
          if (fallbackErrorMsg === 'FALLBACK_NOT_CONFIGURED') {
            toast({
              title: `❌ Резервная модель не настроена`,
              description: `Настройте резервную модель в админ-панели`,
              variant: 'destructive',
              duration: 10000
            });
            
            const errorMsg: Message = {
              role: 'assistant',
              content: `❌ **Превышен лимит запросов (429)**\n\n🔄 **Все резервные варианты недоступны**\n\n---\n\n📝 **Решения:**\n\n**Вариант 1: Добавить второй API ключ (рекомендуется)**\n1. Откройте **⚙️ Настройки** → **Настройки сайта**\n2. Создайте второй аккаунт на [openrouter.ai](https://openrouter.ai)\n3. Вставьте второй ключ в **"OpenRouter API Key #2"**\n4. При ошибке 429 чат автоматически переключится на второй ключ\n\n**Вариант 2: Настроить резервную модель**\n1. Выберите другую модель в **"Резервная модель AI"**\n2. При ошибке 429 чат попробует другую модель\n\n**Вариант 3: Подождать**\n- Подождите 1-2 минуты\n- Попробуйте снова\n\n**Вариант 4: Пополнить баланс**\n- Пополните $5 на [openrouter.ai](https://openrouter.ai)\n- Платные запросы без лимитов`,
              timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
            setIsLoading(false);
            return;
          }
          
          toast({
            title: `❌ Ошибка резервной модели`,
            description: fallbackErrorMsg,
            variant: 'destructive',
            duration: 8000
          });
          
          const errorMsg: Message = {
            role: 'assistant',
            content: `❌ **Основная модель перегружена (429)**\n❌ **Резервная модель тоже не сработала**\n\n**Ошибка:** ${fallbackErrorMsg}\n\n---\n\n📝 **Решение:**\n1. Подождите 1-2 минуты\n2. Попробуйте другую модель в настройках\n3. Или пополните баланс на openrouter.ai ($5)`,
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

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();
      return data[0].map((item: any) => item[0]).join('');
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const translateAllMessages = async (targetLanguage: string, setTranslatedLanguage: (lang: string | null) => void, setTranslatedMessages: (map: Map<number, string>) => void) => {
    if (!targetLanguage) {
      setTranslatedLanguage(null);
      setTranslatedMessages(new Map());
      toast({ title: 'Перевод отключен' });
      return;
    }

    toast({ title: `Перевожу все сообщения на ${targetLanguage}...` });
    
    const translatedMap = new Map<number, string>();
    
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const translated = await translateText(msg.content, targetLanguage);
      translatedMap.set(i, translated);
    }
    
    setTranslatedLanguage(targetLanguage);
    setTranslatedMessages(translatedMap);
    toast({ title: `✅ Все сообщения переведены!` });
  };

  const speakMessage = async (
    text: string, 
    index: number,
    language: string,
    setIsSpeaking: (val: boolean) => void,
    setCurrentSpeakingIndex: (val: number | null) => void
  ) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language || 'ru-RU';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(language)) || voices[0];
      if (voice) utterance.voice = voice;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentSpeakingIndex(index);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentSpeakingIndex(null);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentSpeakingIndex(null);
        toast({ title: 'Ошибка озвучивания', variant: 'destructive' });
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast({ title: 'Озвучка не поддерживается браузером', variant: 'destructive' });
    }
  };

  const stopSpeaking = (setIsSpeaking: (val: boolean) => void, setCurrentSpeakingIndex: (val: number | null) => void) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingIndex(null);
    }
  };

  return {
    handleFileUpload,
    removeFile,
    sendMessage,
    clearHistory,
    copyMessage,
    exportChat,
    translateAllMessages,
    speakMessage,
    stopSpeaking
  };
}