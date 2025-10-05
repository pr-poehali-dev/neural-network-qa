import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface QuickButton {
  id: string;
  text: string;
  emoji: string;
  enabled: boolean;
}

interface QuickButtonsProps {
  buttons: QuickButton[];
  onButtonClick: (text: string) => void;
  className?: string;
}

export default function QuickButtons({ buttons, onButtonClick, className = '' }: QuickButtonsProps) {
  const enabledButtons = buttons.filter(btn => btn.enabled);

  if (enabledButtons.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 mb-4 ${className}`}>
      {enabledButtons.map((button) => (
        <Button
          key={button.id}
          variant="outline"
          size="sm"
          onClick={() => onButtonClick(button.text)}
          className="border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-400 dark:hover:border-indigo-500 text-sm transition-all hover:scale-105"
        >
          <span className="mr-1.5">{button.emoji}</span>
          {button.text}
        </Button>
      ))}
    </div>
  );
}
