import Icon from '@/components/ui/icon';
import ChatAvatar from '@/components/ChatAvatar';
import ChatMessage from './ChatMessage';
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

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  speakingIndex: number | null;
  isTranslating: boolean;
  onSpeak: (text: string, index: number) => void;
}

export default function ChatMessageList({
  messages,
  isLoading,
  speakingIndex,
  isTranslating,
  onSpeak
}: ChatMessageListProps) {
  const { t } = useLanguage();

  return (
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
          <ChatMessage
            key={idx}
            message={msg}
            index={idx}
            speakingIndex={speakingIndex}
            isTranslating={isTranslating}
            onSpeak={onSpeak}
          />
        ))
      )}
    </div>
  );
}