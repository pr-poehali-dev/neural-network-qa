import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface AIChatHeaderProps {
  model: string;
  onExport: () => void;
  onClear: () => void;
  onClose?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  onQuickPrompt?: (text: string) => void;
}

export default function AIChatHeader({ model, onExport, onClear, onClose, onToggleFullscreen, isFullscreen, onQuickPrompt }: AIChatHeaderProps) {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showTranslator, setShowTranslator] = useState(false);

  const QUICK_PROMPTS = [
    { emoji: '💡', text: 'Объясни простыми словами', color: 'from-yellow-500 to-orange-500' },
    { emoji: '📝', text: 'Напиши статью про', color: 'from-blue-500 to-cyan-500' },
    { emoji: '✍️', text: 'Напиши письмо для', color: 'from-purple-500 to-pink-500' },
    { emoji: '📊', text: 'Составь таблицу', color: 'from-green-500 to-emerald-500' },
    { emoji: '🔍', text: 'Проанализируй текст', color: 'from-indigo-500 to-purple-500' },
    { emoji: '✨', text: 'Улучши и исправь', color: 'from-teal-500 to-cyan-500' },
  ];

  const handlePromptClick = (text: string) => {
    if (onQuickPrompt) {
      onQuickPrompt(text);
      setShowQuickMenu(false);
      setShowTranslator(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <Icon name="Sparkles" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Богдан отвечает</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-xs text-white/90 font-medium">Онлайн</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowTranslator(!showTranslator);
              setShowQuickMenu(false);
            }}
            className="hover:bg-white/30 text-white h-9 w-9 p-0"
            title="Переводчик"
          >
            <Icon name="Languages" size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowQuickMenu(!showQuickMenu);
              setShowTranslator(false);
            }}
            className="hover:bg-white/30 text-white h-9 w-9 p-0"
            title="Быстрые команды"
          >
            <Icon name="Menu" size={18} />
          </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onExport}
          title="Экспорт чата"
          className="hover:bg-white/20 text-white h-9 w-9 p-0"
        >
          <Icon name="Download" size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          title="Очистить чат"
          className="hover:bg-white/20 text-white h-9 w-9 p-0"
        >
          <Icon name="Trash2" size={18} />
        </Button>
        {onToggleFullscreen && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
            className="hover:bg-white/30 text-white h-9 w-9 p-0 border-2 border-white/50 bg-white/10"
          >
            <Icon name={isFullscreen ? 'Minimize2' : 'Maximize2'} size={18} />
          </Button>
        )}
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="hover:bg-white/20 text-white h-9 w-9 p-0"
          >
            <Icon name="X" size={20} />
          </Button>
        )}
      </div>
      </div>
      
      {showTranslator && (
        <div className="p-3 bg-blue-900/30 border-b border-blue-500/30">
          <p className="text-xs text-blue-200 mb-2 font-semibold">🌍 Переводчик</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { text: 'Переведи на английский', flag: '🇬🇧' },
              { text: 'Переведи на испанский', flag: '🇪🇸' },
              { text: 'Переведи на немецкий', flag: '🇩🇪' },
              { text: 'Переведи на французский', flag: '🇫🇷' },
              { text: 'Переведи на китайский', flag: '🇨🇳' },
              { text: 'Переведи на японский', flag: '🇯🇵' },
            ].map((lang, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(lang.text)}
                className="bg-blue-600/40 hover:bg-blue-600/60 text-white text-xs py-2 px-3 rounded-lg transition-all hover:scale-105 flex items-center gap-2 justify-center"
              >
                <span>{lang.flag}</span>
                <span className="truncate">{lang.text.replace('Переведи на ', '')}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {showQuickMenu && (
        <div className="p-3 bg-gradient-to-br from-slate-900 to-slate-800 border-b border-white/10">
          <p className="text-xs text-yellow-400 mb-2 font-semibold flex items-center gap-2">
            <Icon name="Zap" size={14} />
            Быстрые команды
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt.text)}
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
    </>
  );
}