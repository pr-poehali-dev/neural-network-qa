import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';
import ChatAvatar from '@/components/ChatAvatar';
import ReactMarkdown from 'react-markdown';
import SearchMessages from '@/components/SearchMessages';

interface Message {
  role: 'user' | 'ai';
  text: string;
  file?: any;
  imageUrl?: string;
  isFavorite?: boolean;
  detectedLanguage?: string;
  translatedFrom?: string;
}

const quickReplies = [
  { emoji: '👍', text: 'Да, точно', category: 'common' },
  { emoji: '👎', text: 'Нет, не то', category: 'common' },
  { emoji: '🤔', text: 'Не понял, объясни подробнее', category: 'common' },
  { emoji: '✅', text: 'Спасибо, понятно', category: 'common' },
  { emoji: '🔄', text: 'Повтори, пожалуйста', category: 'common' },
  { emoji: '⏰', text: 'Поставь таймер на 5 минут', category: 'timer' },
  { emoji: '📝', text: 'Запиши это', category: 'note' },
  { emoji: '🔍', text: 'Где я могу это найти?', category: 'search' },
];

interface ChatContainerProps {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  isGeneratingImage: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onGenerateImage: () => void;
  onSaveChat: () => void;
  onExportChat: () => void;
  onClearChat: () => void;
  onToggleFavorite?: (index: number) => void;
}

export default function ChatContainer({
  messages,
  inputMessage,
  isLoading,
  isGeneratingImage,
  onInputChange,
  onSendMessage,
  onGenerateImage,
  onSaveChat,
  onExportChat,
  onClearChat,
  onToggleFavorite
}: ChatContainerProps) {
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isDictationMode, setIsDictationMode] = useState(false);
  const [dictationText, setDictationText] = useState('');
  const { voiceLanguage, translateToLanguage, autoDetectLanguage, voiceSpeed, t } = useLanguage();

  const getSmartSuggestions = (input: string): string[] => {
    const lowerInput = input.toLowerCase().trim();
    
    const suggestionMap: { [key: string]: string[] } = {
      'как': ['Как это работает?', 'Как мне начать?', 'Как настроить?'],
      'что': ['Что это значит?', 'Что мне делать?', 'Что ты умеешь?'],
      'когда': ['Когда лучше начать?', 'Когда это будет готово?'],
      'где': ['Где это найти?', 'Где можно узнать больше?'],
      'почему': ['Почему так происходит?', 'Почему это важно?'],
      'помоги': ['Помоги разобраться', 'Помоги решить проблему'],
      'расскажи': ['Расскажи подробнее', 'Расскажи про это'],
      'объясни': ['Объясни простыми словами', 'Объясни пошагово'],
    };

    for (const [key, suggestions] of Object.entries(suggestionMap)) {
      if (lowerInput.startsWith(key)) {
        return suggestions;
      }
    }

    if (lowerInput.length > 3) {
      return ['Продолжить эту тему?', 'Узнать больше деталей?', 'Пример использования?'];
    }

    return [];
  };

  const speakText = async (text: string, index: number) => {
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      setIsTranslating(false);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingIndex(index);

    const targetLang = voiceLanguage.split('-')[0];
    let textToSpeak = text;

    if (targetLang !== 'ru') {
      try {
        setIsTranslating(true);
        textToSpeak = await translateText(text, 'ru', targetLang);
        setIsTranslating(false);
      } catch (error) {
        console.error('Translation failed, using original text');
        setIsTranslating(false);
      }
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = voiceLanguage;
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    
    window.speechSynthesis.speak(utterance);
  };

  const getLanguageName = (code: string): string => {
    const languages: Record<string, string> = {
      'ru': 'Русский',
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'zh': '中文',
      'ja': '日本語',
      'ar': 'العربية',
      'pt': 'Português',
      'it': 'Italiano',
      'ko': '한국어',
      'tr': 'Türkçe',
      'pl': 'Polski',
      'uk': 'Українська',
      'hi': 'हिन्दी'
    };
    return languages[code] || code.toUpperCase();
  };

  const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      return data[0][0][0];
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = autoDetectLanguage ? '' : voiceLanguage;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      
      if (autoDetectLanguage && translateToLanguage) {
        const detectedLang = (event.results[0][0] as any).language || 'auto';
        const sourceLangCode = detectedLang.split('-')[0];
        
        if (sourceLangCode !== translateToLanguage) {
          const translated = await translateText(transcript, sourceLangCode, translateToLanguage);
          onInputChange(`🌐 ${translated}\n\n📍 ${getLanguageName(sourceLangCode)} → ${getLanguageName(translateToLanguage)}`);
        } else {
          onInputChange(transcript);
        }
      } else {
        onInputChange(transcript);
      }
      
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const startDictationMode = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    if (isDictationMode) {
      setIsDictationMode(false);
      setIsListening(false);
      if (dictationText.trim()) {
        onInputChange(dictationText);
        setDictationText('');
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = voiceLanguage;
    recognition.continuous = true;
    recognition.interimResults = true;

    setIsDictationMode(true);
    setIsListening(true);
    setDictationText('');

    let silenceTimer: NodeJS.Timeout;
    let lastTranscript = '';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript = transcript;
        }
      }

      if (finalTranscript) {
        lastTranscript = finalTranscript;
        setDictationText(prev => prev + finalTranscript);
        
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          setDictationText(prev => prev + '. ');
        }, 1500);
      }
    };

    recognition.onerror = () => {
      setIsDictationMode(false);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isDictationMode) {
        recognition.start();
      }
    };

    recognition.start();
  };

  return (
    <Card className="p-8 border-2 border-purple-200 dark:border-purple-800 dark:bg-gray-900 flex flex-col animate-slide-up min-h-[600px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <Icon name="MessageSquare" className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('chat.title')}</h3>
            {messages.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {messages.length} {messages.length === 1 ? 'сообщение' : messages.length < 5 ? 'сообщения' : 'сообщений'}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {messages.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={onExportChat} className="dark:border-purple-800">
                <Icon name="Download" className="mr-2" size={16} />
                {t('chat.export')}
              </Button>
              <Button variant="outline" size="sm" onClick={onClearChat} className="dark:border-purple-800">
                <Icon name="Plus" className="mr-2" size={16} />
                {t('chat.new')}
              </Button>
            </>
          )}
        </div>
      </div>



      <div className="flex-1 bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20 rounded-xl p-6 mb-6 overflow-y-auto space-y-4">
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3 justify-start animate-fade-in">
            <ChatAvatar type="ai" size={40} />
            <div className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 rounded-2xl px-5 py-4 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-32">
            <Icon name="Sparkles" className="mx-auto mb-6 text-purple-400" size={64} />
            <h4 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">{t('chat.start')}</h4>
            <p className="text-lg">{t('chat.askQuestion')}</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in group`}>
              {msg.role === 'assistant' && <ChatAvatar type="ai" size={40} />}
              <div className={`max-w-[80%] rounded-2xl px-5 py-4 relative ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                  : 'bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 text-gray-900 dark:text-white shadow-sm'
              }`}>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 prose prose-sm dark:prose-invert max-w-none">
                    {msg.role === 'ai' ? (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                      <span className="text-base whitespace-pre-wrap">{msg.text}</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(msg.text);
                      }}
                      className="flex-shrink-0 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      title={t('chat.copy')}
                    >
                      <Icon name="Copy" size={16} />
                    </button>
                    {msg.role === 'ai' && (
                      <div className="relative">
                        <button
                          onClick={() => speakText(msg.text, idx)}
                          className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                            speakingIndex === idx
                              ? 'bg-purple-600 text-white'
                              : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800'
                          }`}
                          title={speakingIndex === idx ? t('chat.stop') : t('chat.speak')}
                        >
                          <Icon 
                            name={speakingIndex === idx ? 'VolumeX' : 'Volume2'} 
                            size={16} 
                          />
                        </button>
                        {speakingIndex === idx && isTranslating && (
                          <div className="absolute -top-10 right-0 bg-purple-600 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg animate-fade-in flex items-center gap-1.5">
                            <Icon name="Languages" size={12} className="animate-pulse" />
                            <span>Перевожу...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {msg.imageUrl && (
                  <div className="mt-3">
                    <img src={msg.imageUrl} alt="Generated" className="rounded-lg max-w-full" />
                  </div>
                )}
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
        {showQuickReplies && messages.length > 0 && (
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {quickReplies.map((reply, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => {
                  onInputChange(reply.text);
                  setShowQuickReplies(false);
                }}
                className="border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 text-sm"
              >
                <span className="mr-1">{reply.emoji}</span>
                {reply.text}
              </Button>
            ))}
          </div>
        )}
        
        {isDictationMode && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-3 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">🎙️ Режим диктовки активен</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={startDictationMode}
                className="text-green-700 dark:text-green-300"
              >
                Стоп
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {dictationText || 'Говорите... Автоматическая пауза через 1.5 сек после речи'}
            </p>
          </div>
        )}
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea 
              placeholder={isDictationMode ? 'Режим диктовки активен...' : t('chat.placeholder')} 
              value={inputMessage}
              onChange={(e) => {
                onInputChange(e.target.value);
                if (e.target.value.length > 2 && !isDictationMode) {
                  const suggestions = getSmartSuggestions(e.target.value);
                  if (suggestions.length > 0 && Math.random() > 0.7) {
                    setTimeout(() => {
                      if (document.activeElement === e.target) {
                        const bubble = document.createElement('div');
                        bubble.className = 'absolute -top-12 left-0 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1.5 rounded-lg text-sm animate-fade-in shadow-lg cursor-pointer';
                        bubble.textContent = '💡 ' + suggestions[Math.floor(Math.random() * suggestions.length)];
                        bubble.onclick = () => {
                          onInputChange(bubble.textContent!.replace('💡 ', ''));
                          bubble.remove();
                        };
                        e.target.parentElement?.appendChild(bubble);
                        setTimeout(() => bubble.remove(), 3000);
                      }
                    }, 1000);
                  }
                }
              }}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSendMessage())}
              className="resize-none border-purple-200 dark:border-purple-800 dark:bg-gray-800 dark:text-white focus:border-indigo-500 text-base pr-16"
              rows={3}
              disabled={isLoading || isGeneratingImage || isListening || isDictationMode}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
              {inputMessage.length} / 1000
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              variant="outline"
              size="lg"
              disabled={isLoading || isGeneratingImage || isDictationMode}
              className="border-purple-200 dark:border-purple-800"
              title="Быстрые ответы"
            >
              <Icon name="MessageCircle" size={20} />
            </Button>
            <Button
              onClick={startDictationMode}
              variant="outline"
              size="lg"
              disabled={isLoading || isGeneratingImage}
              className={`border-purple-200 dark:border-purple-800 ${isDictationMode ? 'bg-green-100 dark:bg-green-900 border-green-500 animate-pulse' : ''}`}
              title="Режим диктовки (непрерывная запись)"
            >
              <Icon name={isDictationMode ? "MicOff" : "Mic"} size={20} />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={onSendMessage}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
            size="lg"
            disabled={isLoading || isGeneratingImage || isListening || !inputMessage.trim()}
          >
            {isLoading ? (
              <Icon name="Loader2" size={20} className="animate-spin mr-2" />
            ) : (
              <Icon name="Send" size={20} className="mr-2" />
            )}
            {isListening ? t('chat.listening') : t('chat.answer')}
          </Button>
        </div>
      </div>
    </Card>
  );
}