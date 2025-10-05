import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ChatAvatar from '@/components/ChatAvatar';
import RatingButtons from '@/components/RatingButtons';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  role: 'user' | 'ai';
  text: string;
  file?: any;
  imageUrl?: string;
  images?: Array<{name: string; base64: string; mimeType: string}>;
  isFavorite?: boolean;
  detectedLanguage?: string;
  translatedFrom?: string;
}

interface ChatMessageProps {
  message: Message;
  index: number;
  speakingIndex: number | null;
  isTranslating: boolean;
  onSpeak: (text: string, index: number) => void;
}

export default function ChatMessage({
  message,
  index,
  speakingIndex,
  isTranslating,
  onSpeak
}: ChatMessageProps) {
  const { t } = useLanguage();

  return (
    <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in group`}>
      {message.role === 'ai' && <ChatAvatar type="ai" size={40} />}
      <div className={`max-w-[80%] rounded-2xl px-5 py-4 relative ${
        message.role === 'user' 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
          : 'bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 text-gray-900 dark:text-white shadow-sm'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 prose prose-sm dark:prose-invert max-w-none">
            {message.role === 'ai' ? (
              <ReactMarkdown>{message.text}</ReactMarkdown>
            ) : (
              <span className="text-base whitespace-pre-wrap">{message.text}</span>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => {
                navigator.clipboard.writeText(message.text);
              }}
              className="flex-shrink-0 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              title={t('chat.copy')}
            >
              <Icon name="Copy" size={16} />
            </button>
            {message.role === 'ai' && (
              <div className="relative">
                <button
                  onClick={() => onSpeak(message.text, index)}
                  className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                    speakingIndex === index
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800'
                  }`}
                  title={speakingIndex === index ? t('chat.stop') : t('chat.speak')}
                >
                  <Icon 
                    name={speakingIndex === index ? 'VolumeX' : 'Volume2'} 
                    size={16} 
                  />
                </button>
                {speakingIndex === index && isTranslating && (
                  <div className="absolute -top-10 right-0 bg-purple-600 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg animate-fade-in flex items-center gap-1.5">
                    <Icon name="Languages" size={12} className="animate-pulse" />
                    <span>Перевожу...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {message.imageUrl && (
          <div className="mt-3">
            <img src={message.imageUrl} alt="Generated" className="rounded-lg max-w-full" />
          </div>
        )}
        {message.images && message.images.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.images.map((img, idx) => (
              <div key={idx} className="border border-purple-200 dark:border-purple-700 rounded-lg overflow-hidden">
                <img 
                  src={`data:${img.mimeType || 'image/jpeg'};base64,${img.base64}`} 
                  alt={img.name} 
                  className="max-w-full rounded-lg"
                />
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
                  <Icon name="Image" className="inline mr-1" size={12} />
                  {img.name}
                </div>
              </div>
            ))}
          </div>
        )}
        {message.file && (
          <div className="mt-2 pt-2 border-t border-white/20">
            <Icon name="FileText" className="inline mr-1" size={14} />
            <span className="text-xs opacity-80">{message.file.name}</span>
          </div>
        )}
        {message.role === 'ai' && message.text && (
          <RatingButtons 
            messageIndex={index}
            messageText={message.text}
          />
        )}
      </div>
    </div>
  );
}