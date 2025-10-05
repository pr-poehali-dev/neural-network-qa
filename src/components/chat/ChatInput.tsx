import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatInputProps {
  inputMessage: string;
  isLoading: boolean;
  isGeneratingImage: boolean;
  isListening: boolean;
  isDictationMode: boolean;
  dictationText: string;
  showQuickReplies: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onToggleQuickReplies: () => void;
  onStartDictation: () => void;
  getSmartSuggestions: (input: string) => string[];
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

export default function ChatInput({
  inputMessage,
  isLoading,
  isGeneratingImage,
  isListening,
  isDictationMode,
  dictationText,
  showQuickReplies,
  onInputChange,
  onSendMessage,
  onToggleQuickReplies,
  onStartDictation,
  getSmartSuggestions
}: ChatInputProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      {showQuickReplies && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {quickReplies.map((reply, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => {
                onInputChange(reply.text);
                onToggleQuickReplies();
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
              onClick={onStartDictation}
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
            onClick={onToggleQuickReplies}
            variant="outline"
            size="lg"
            disabled={isLoading || isGeneratingImage || isDictationMode}
            className="border-purple-200 dark:border-purple-800"
            title="Быстрые ответы"
          >
            <Icon name="MessageCircle" size={20} />
          </Button>
          <Button
            onClick={onStartDictation}
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
  );
}
