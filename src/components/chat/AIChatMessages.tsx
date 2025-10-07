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
  { emoji: '💡', text: 'Объясни простыми словами', color: 'from-yellow-500 to-orange-500' },
  { emoji: '📝', text: 'Напиши статью про', color: 'from-blue-500 to-cyan-500' },
  { emoji: '✍️', text: 'Напиши письмо для', color: 'from-purple-500 to-pink-500' },
  { emoji: '📊', text: 'Составь таблицу', color: 'from-green-500 to-emerald-500' },
  { emoji: '🔍', text: 'Проанализируй текст', color: 'from-indigo-500 to-purple-500' },
  { emoji: '✨', text: 'Улучши и исправь', color: 'from-teal-500 to-cyan-500' },
  { emoji: '🌍', text: 'Переведи на английский', color: 'from-red-500 to-orange-500' },
  { emoji: '💼', text: 'Создай бизнес-план', color: 'from-gray-600 to-gray-800' },
  { emoji: '🎨', text: 'Придумай креативное название', color: 'from-pink-500 to-rose-500' },
  { emoji: '📋', text: 'Сделай список задач', color: 'from-violet-500 to-purple-500' },
  { emoji: '🤖', text: 'Напиши код на Python', color: 'from-blue-600 to-indigo-600' },
  { emoji: '📧', text: 'Составь email рассылку', color: 'from-orange-500 to-red-500' },
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
        <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Zap" size={16} className="text-yellow-400" />
            <p className="text-sm font-bold text-white">Быстрые команды</p>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => onQuickPrompt(prompt.text)}
                className={`group relative overflow-hidden rounded-xl p-3 text-left transition-all duration-300 hover:scale-105 bg-gradient-to-br ${prompt.color} hover:shadow-lg`}
              >
                <div className="relative z-10">
                  <div className="text-2xl mb-1">{prompt.emoji}</div>
                  <p className="text-xs font-medium text-white leading-tight">{prompt.text}</p>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </button>
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
            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl rounded-2xl p-6 text-left text-sm space-y-4 max-w-md mx-auto border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Icon name="Sparkles" size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-base">Что я умею:</p>
                  <p className="text-xs text-gray-300">Powered by Gemini 2.0 Flash</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: 'MessageSquare', text: 'Диалоги' },
                  { icon: 'FileText', text: 'Тексты' },
                  { icon: 'Code', text: 'Код' },
                  { icon: 'Image', text: 'Фото' },
                  { icon: 'Globe', text: 'Переводы' },
                  { icon: 'Briefcase', text: 'Бизнес' },
                  { icon: 'GraduationCap', text: 'Обучение' },
                  { icon: 'Sparkles', text: 'Креатив' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white/90 bg-white/5 rounded-lg p-2">
                    <Icon name={item.icon as any} size={14} />
                    <span className="text-xs font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-3 border border-blue-400/30">
                <p className="text-white font-semibold text-xs mb-1 flex items-center gap-2">
                  <Icon name="Lightbulb" size={14} />
                  Совет:
                </p>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Используйте кнопки внизу для загрузки 📸 изображений и 🎤 голосового ввода!
                </p>
              </div>
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