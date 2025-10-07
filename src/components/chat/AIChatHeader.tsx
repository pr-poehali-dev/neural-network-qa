import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { getModelCapabilities } from '@/utils/modelCapabilities';

interface AIChatHeaderProps {
  model: string;
  onExport: () => void;
  onClear: () => void;
  onClose?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  onQuickPrompt?: (text: string) => void;
  onModelChange?: (model: string) => void;
}

export default function AIChatHeader({ model, onExport, onClear, onClose, onToggleFullscreen, isFullscreen, onQuickPrompt, onModelChange }: AIChatHeaderProps) {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showTranslator, setShowTranslator] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);

  const ALL_AI_MODELS = [
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0', icon: '⭐', desc: 'Быстрая, видит фото', color: 'from-blue-500 to-cyan-500' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', icon: '🔥', desc: 'Мощная, только текст', color: 'from-orange-500 to-red-500' },
    { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B', icon: '⚡', desc: 'Быстрая, легкая', color: 'from-green-500 to-emerald-500' },
    { id: 'microsoft/phi-3-medium-128k-instruct:free', name: 'Phi-3 Medium', icon: '💼', desc: 'Большой контекст', color: 'from-purple-500 to-pink-500' },
  ];

  const savedSettings = localStorage.getItem('site_settings');
  const disabledModels = savedSettings ? (JSON.parse(savedSettings).disabledModels || []) : [];
  const AI_MODELS = ALL_AI_MODELS.filter(m => !disabledModels.includes(m.id));

  const currentModel = ALL_AI_MODELS.find(m => m.id === model) || ALL_AI_MODELS[0];

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
            <h3 className="font-bold text-white text-lg">AI Ассистент</h3>
            <button 
              onClick={() => {
                setShowModelSelector(!showModelSelector);
                setShowQuickMenu(false);
                setShowTranslator(false);
              }}
              className="flex items-center gap-2 hover:bg-white/10 rounded px-2 py-0.5 transition-colors"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-xs text-white/90 font-medium">{currentModel.icon} {currentModel.name}</p>
              <Icon name="ChevronDown" size={14} className="text-white/70" />
            </button>
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
        <div className="p-3 bg-blue-900/30 border-b border-blue-500/30 max-h-96 overflow-y-auto">
          <p className="text-xs text-blue-200 mb-3 font-semibold flex items-center gap-2">
            <Icon name="Languages" size={14} />
            🌍 Переводчик (100+ языков)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { text: 'Переведи на английский', flag: '🇬🇧', name: 'English' },
              { text: 'Переведи на испанский', flag: '🇪🇸', name: 'Español' },
              { text: 'Переведи на немецкий', flag: '🇩🇪', name: 'Deutsch' },
              { text: 'Переведи на французский', flag: '🇫🇷', name: 'Français' },
              { text: 'Переведи на китайский', flag: '🇨🇳', name: '中文' },
              { text: 'Переведи на японский', flag: '🇯🇵', name: '日本語' },
              { text: 'Переведи на корейский', flag: '🇰🇷', name: '한국어' },
              { text: 'Переведи на итальянский', flag: '🇮🇹', name: 'Italiano' },
              { text: 'Переведи на португальский', flag: '🇵🇹', name: 'Português' },
              { text: 'Переведи на арабский', flag: '🇸🇦', name: 'العربية' },
              { text: 'Переведи на турецкий', flag: '🇹🇷', name: 'Türkçe' },
              { text: 'Переведи на польский', flag: '🇵🇱', name: 'Polski' },
              { text: 'Переведи на украинский', flag: '🇺🇦', name: 'Українська' },
              { text: 'Переведи на чешский', flag: '🇨🇿', name: 'Čeština' },
              { text: 'Переведи на греческий', flag: '🇬🇷', name: 'Ελληνικά' },
              { text: 'Переведи на хинди', flag: '🇮🇳', name: 'हिन्दी' },
              { text: 'Переведи на тайский', flag: '🇹🇭', name: 'ไทย' },
              { text: 'Переведи на вьетнамский', flag: '🇻🇳', name: 'Tiếng Việt' },
              { text: 'Переведи на голландский', flag: '🇳🇱', name: 'Nederlands' },
              { text: 'Переведи на шведский', flag: '🇸🇪', name: 'Svenska' },
              { text: 'Переведи на финский', flag: '🇫🇮', name: 'Suomi' },
              { text: 'Переведи на норвежский', flag: '🇳🇴', name: 'Norsk' },
              { text: 'Переведи на датский', flag: '🇩🇰', name: 'Dansk' },
              { text: 'Переведи на румынский', flag: '🇷🇴', name: 'Română' },
            ].map((lang, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(lang.text)}
                className="bg-blue-600/40 hover:bg-blue-600/60 text-white text-xs py-2 px-2 rounded-lg transition-all hover:scale-105 flex items-center gap-1 justify-center"
                title={lang.name}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="truncate text-[10px]">{lang.name}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-blue-300 mt-2 text-center">+ еще 76 языков по запросу</p>
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

      {showModelSelector && onModelChange && (
        <div className="p-3 bg-gradient-to-br from-indigo-900 to-purple-900 border-b border-white/10">
          <p className="text-xs text-yellow-400 mb-3 font-semibold flex items-center gap-2">
            <Icon name="Cpu" size={14} />
            Выберите AI модель
          </p>
          <div className="grid grid-cols-1 gap-2">
            {AI_MODELS.map((aiModel) => {
              const capabilities = getModelCapabilities(aiModel.id);
              return (
                <button
                  key={aiModel.id}
                  onClick={() => {
                    if (onModelChange) {
                      onModelChange(aiModel.id);
                      setShowModelSelector(false);
                    }
                  }}
                  className={`group relative overflow-hidden rounded-xl p-3 text-left transition-all duration-300 hover:scale-102 bg-gradient-to-br ${aiModel.color} hover:shadow-lg ${model === aiModel.id ? 'ring-2 ring-white/50' : ''}`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{aiModel.icon}</span>
                        <p className="text-sm font-bold text-white">{aiModel.name}</p>
                      </div>
                      {model === aiModel.id && (
                        <Icon name="Check" size={20} className="text-white" />
                      )}
                    </div>
                    <p className="text-xs text-white/80 mb-2">{aiModel.desc}</p>
                    <div className="flex flex-wrap gap-1">
                      {capabilities.features.images && (
                        <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded">📷 Фото</span>
                      )}
                      {capabilities.features.files && (
                        <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded">📎 Файлы</span>
                      )}
                      {capabilities.features.code && (
                        <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded">💻 Код</span>
                      )}
                      <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded">
                        {capabilities.limits.speed === 'fast' ? '⚡ Быстро' : capabilities.limits.speed === 'medium' ? '🚀 Средне' : '🐢 Медленно'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-white/60 mt-2 text-center">Все модели бесплатные</p>
        </div>
      )}
    </>
  );
}