import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Message {
  role: 'user' | 'ai';
  text: string;
  file?: any;
  imageUrl?: string;
  isFavorite?: boolean;
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

  const speakText = (text: string, index: number) => {
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Card className="p-8 border-2 border-purple-200 flex flex-col animate-slide-up min-h-[600px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <Icon name="MessageSquare" className="text-white" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Чат</h3>
        </div>
        <div className="flex gap-2">
          {messages.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={onSaveChat}>
                <Icon name="Save" className="mr-2" size={16} />
                Сохранить
              </Button>
              <Button variant="outline" size="sm" onClick={onExportChat}>
                <Icon name="Download" className="mr-2" size={16} />
                Экспорт
              </Button>
              <Button variant="outline" size="sm" onClick={onClearChat}>
                <Icon name="Plus" className="mr-2" size={16} />
                Новый
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-xl p-6 mb-6 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-32">
            <Icon name="Sparkles" className="mx-auto mb-6 text-purple-400" size={64} />
            <h4 className="text-2xl font-bold text-gray-700 mb-3">Начните диалог</h4>
            <p className="text-lg">Задайте любой вопрос</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in group`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-4 relative ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                  : 'bg-white border border-purple-200 text-gray-900 shadow-sm'
              }`}>
                {onToggleFavorite && (
                  <button
                    onClick={() => onToggleFavorite(idx)}
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${
                      msg.isFavorite 
                        ? 'bg-yellow-400 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-yellow-400 hover:text-white'
                    }`}
                  >
                    <Icon name="Star" size={14} fill={msg.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {msg.role === 'ai' && (
                      <Icon name="Sparkles" className="inline mr-2 text-purple-600" size={18} />
                    )}
                    <span className="text-base">{msg.text}</span>
                  </div>
                  {msg.role === 'ai' && (
                    <button
                      onClick={() => speakText(msg.text, idx)}
                      className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                        speakingIndex === idx
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                      title={speakingIndex === idx ? 'Остановить' : 'Озвучить'}
                    >
                      <Icon 
                        name={speakingIndex === idx ? 'VolumeX' : 'Volume2'} 
                        size={18} 
                      />
                    </button>
                  )}
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
              placeholder="Задайте вопрос или описание для изображения..." 
              value={inputMessage}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSendMessage())}
              className="resize-none border-purple-200 focus:border-indigo-500 text-base"
              rows={3}
              disabled={isLoading || isGeneratingImage}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={onSendMessage}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
            size="lg"
            disabled={isLoading || isGeneratingImage}
          >
            {isLoading ? (
              <Icon name="Loader2" size={20} className="animate-spin mr-2" />
            ) : (
              <Icon name="MessageSquare" size={20} className="mr-2" />
            )}
            Ответить
          </Button>
        </div>
      </div>
    </Card>
  );
}