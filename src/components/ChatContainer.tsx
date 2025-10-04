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
  const { voiceLanguage, translateToLanguage, autoDetectLanguage, t } = useLanguage();

  const speakText = (text: string, index: number) => {
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLanguage;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    
    setSpeakingIndex(index);
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
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea 
              placeholder={t('chat.placeholder')} 
              value={inputMessage}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSendMessage())}
              className="resize-none border-purple-200 dark:border-purple-800 dark:bg-gray-800 dark:text-white focus:border-indigo-500 text-base pr-16"
              rows={3}
              disabled={isLoading || isGeneratingImage || isListening}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
              {inputMessage.length} / 1000
            </div>
          </div>
          <Button
            onClick={startVoiceInput}
            variant="outline"
            size="lg"
            disabled={isLoading || isGeneratingImage || isListening}
            className={`border-purple-200 dark:border-purple-800 ${isListening ? 'bg-red-100 dark:bg-red-900 border-red-500' : ''}`}
            title={t('chat.voiceInput')}
          >
            <Icon name={isListening ? "MicOff" : "Mic"} size={20} />
          </Button>
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