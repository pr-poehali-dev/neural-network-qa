import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface ReadingModePanelProps {
  messages: Message[];
  onClose: () => void;
}

export default function ReadingModePanel({ messages, onClose }: ReadingModePanelProps) {
  const [fontSize, setFontSize] = useState(18);
  const [isAutoScroll, setIsAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(50);

  const aiMessages = messages.filter(m => m.role === 'ai');

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 32));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 14));

  const startAutoScroll = () => {
    if (isAutoScroll) {
      setIsAutoScroll(false);
      return;
    }

    setIsAutoScroll(true);
    const scrollContainer = document.getElementById('reading-content');
    if (!scrollContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight) {
        scrollContainer.scrollTop += 1;
        if (isAutoScroll) {
          setTimeout(scroll, scrollSpeed);
        }
      } else {
        setIsAutoScroll(false);
      }
    };
    scroll();
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Icon name="BookOpen" className="text-white" size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">📖 Режим чтения</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={decreaseFontSize}
            className="border-gray-300 dark:border-gray-700"
          >
            <Icon name="Minus" size={16} />
          </Button>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-12 text-center">
            {fontSize}px
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={increaseFontSize}
            className="border-gray-300 dark:border-gray-700"
          >
            <Icon name="Plus" size={16} />
          </Button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

          <Button
            variant={isAutoScroll ? "default" : "outline"}
            size="sm"
            onClick={startAutoScroll}
            className={isAutoScroll ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-300 dark:border-gray-700'}
          >
            <Icon name={isAutoScroll ? "Pause" : "Play"} className="mr-2" size={16} />
            {isAutoScroll ? 'Стоп' : 'Авто-прокрутка'}
          </Button>

          {isAutoScroll && (
            <div className="flex items-center gap-2 ml-2">
              <Icon name="Gauge" size={16} className="text-gray-500" />
              <input
                type="range"
                min="10"
                max="100"
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(101 - parseInt(e.target.value))}
                className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="ml-2"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>

      <div
        id="reading-content"
        className="flex-1 overflow-y-auto px-8 py-6"
        style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
      >
        <div className="max-w-4xl mx-auto">
          {aiMessages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-32">
              <Icon name="BookOpen" className="mx-auto mb-4 opacity-30" size={64} />
              <p className="text-xl">Нет сообщений для чтения</p>
            </div>
          ) : (
            aiMessages.map((msg, idx) => (
              <div key={idx} className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800 last:border-0">
                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>📄 {aiMessages.length} ответов</span>
          <span>💡 Совет: используйте колёсико мыши для прокрутки</span>
        </div>
      </div>
    </div>
  );
}
