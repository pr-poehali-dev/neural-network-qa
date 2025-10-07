import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AIChatHeaderProps {
  model: string;
  onExport: () => void;
  onClear: () => void;
  onClose?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export default function AIChatHeader({ model, onExport, onClear, onClose, onToggleFullscreen, isFullscreen }: AIChatHeaderProps) {
  return (
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
      <div className="flex gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onExport}
          title="Экспорт чата"
          className="hover:bg-white/20 text-white"
        >
          <Icon name="Download" size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          title="Очистить чат"
          className="hover:bg-white/20 text-white"
        >
          <Icon name="Trash2" size={16} />
        </Button>
        {onToggleFullscreen && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
            className="hover:bg-white/20 text-white"
          >
            <Icon name={isFullscreen ? 'Minimize2' : 'Maximize2'} size={16} />
          </Button>
        )}
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="hover:bg-white/20 text-white"
          >
            <Icon name="X" size={18} />
          </Button>
        )}
      </div>
    </div>
  );
}