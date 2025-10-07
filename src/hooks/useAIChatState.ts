import { useState, useRef, useEffect } from 'react';
import { Message } from '@/components/chat/AIChatMessages';

interface UseAIChatStateProps {
  embedded: boolean;
  apiKey?: string;
}

export function useAIChatState({ embedded, apiKey }: UseAIChatStateProps) {
  const [showChat, setShowChat] = useState(embedded);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [showSpecialCommands, setShowSpecialCommands] = useState(false);
  const [totalTokens, setTotalTokens] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<{
    name: string;
    content: string;
    type: 'text' | 'image';
    dataUrl?: string;
  }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [translatedLanguage, setTranslatedLanguage] = useState<string | null>(null);
  const [translatedMessages, setTranslatedMessages] = useState<Map<number, string>>(new Map());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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
  }, [apiKey]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  return {
    showChat,
    setShowChat,
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    setIsLoading,
    showQuickPrompts,
    setShowQuickPrompts,
    showSpecialCommands,
    setShowSpecialCommands,
    totalTokens,
    setTotalTokens,
    uploadedFiles,
    setUploadedFiles,
    isFullscreen,
    setIsFullscreen,
    messagesEndRef,
    fileInputRef,
    imageInputRef,
    translatedLanguage,
    setTranslatedLanguage,
    translatedMessages,
    setTranslatedMessages,
    isSpeaking,
    setIsSpeaking,
    currentSpeakingIndex,
    setCurrentSpeakingIndex,
  };
}