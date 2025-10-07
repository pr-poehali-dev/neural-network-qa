import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AIChatHeaderProps {
  model: string;
  onExport: () => void;
  onClear: () => void;
  onClose?: () => void;
}

export default function AIChatHeader({ model, onExport, onClear, onClose }: AIChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <div>
          <h3 className="font-semibold text-white">Богдан отвечает</h3>
          <p className="text-xs text-white/80">Онлайн</p>
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