import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
  files?: {name: string; content: string; type: 'text' | 'image'; dataUrl?: string}[];
}

interface AIChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onCopyMessage: (content: string) => void;
  showQuickPrompts: boolean;
  onQuickPrompt: (text: string) => void;
}

const QUICK_PROMPTS = [
  { emoji: '💡', text: 'Объясни простыми словами' },
  { emoji: '📝', text: 'Напиши текст про' },
  { emoji: '🔍', text: 'Проанализируй документ' },
  { emoji: '✨', text: 'Улучши и исправь' },
  { emoji: '📊', text: 'Сделай краткое резюме' },
  { emoji: '🌍', text: 'Переведи на' },
];

export default function AIChatMessages({ 
  messages, 
  isLoading, 
  messagesEndRef, 
  onCopyMessage,
  showQuickPrompts,
  onQuickPrompt
}: AIChatMessagesProps) {
  return (
    <>
      {showQuickPrompts && messages.length === 0 && (
        <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Быстрые команды:</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => onQuickPrompt(prompt.text)}
                className="justify-start text-xs hover:bg-white dark:hover:bg-gray-700"
              >
                <span className="mr-1">{prompt.emoji}</span>
                {prompt.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
            <Icon name="Bot" size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-medium mb-2 text-lg">Привет! Я Богдан ИИ 👋</p>
            <p className="text-sm mb-4">Ваш умный помощник с искусственным интеллектом</p>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-left text-xs space-y-2 max-w-xs mx-auto">
              <p className="font-medium text-indigo-900 dark:text-indigo-100">Я могу помочь вам:</p>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li>💬 Отвечать на вопросы</li>
                <li>📝 Создавать тексты</li>
                <li>📄 Анализировать документы</li>
                <li>🌍 Переводить тексты</li>
                <li>💡 Генерировать идеи</li>
              </ul>
              <p className="text-indigo-700 dark:text-indigo-300 font-medium pt-2 border-t border-indigo-200 dark:border-indigo-800">
                📎 Прикрепите файл кнопкой внизу!
              </p>
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 relative ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-start gap-2">
                <Icon 
                  name={msg.role === 'user' ? 'User' : 'Bot'} 
                  size={16} 
                  className="mt-1 flex-shrink-0"
                />
                <div className="flex-1">
                  {msg.files && msg.files.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {msg.files.map((file, fileIdx) => (
                        <div key={fileIdx} className="bg-white/20 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                          <Icon name="FileText" size={10} />
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  {msg.timestamp && (
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  )}
                </div>
              </div>
              
              {msg.role === 'assistant' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCopyMessage(msg.content)}
                  className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Копировать"
                >
                  <Icon name="Copy" size={14} />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center gap-2">
              <Icon name="Loader2" className="animate-spin text-indigo-600" size={20} />
              <span className="text-sm text-gray-600 dark:text-gray-400">AI печатает...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}