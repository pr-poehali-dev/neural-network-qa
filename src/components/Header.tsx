import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import AIStatusIndicator from './AIStatusIndicator';

interface HeaderProps {
  chatHistoryLength: number;
  onToggleHistory: () => void;
}

export default function Header({ chatHistoryLength, onToggleHistory }: HeaderProps) {
  return (
    <header className="border-b border-white/20 backdrop-blur-md bg-white/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Icon name="Brain" className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Богдан ИИ
              </h1>
            </div>
            <AIStatusIndicator />
          </div>
          <nav className="flex gap-6 items-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onToggleHistory}
              className="border-purple-200"
            >
              <Icon name="History" className="mr-2" size={16} />
              История ({chatHistoryLength})
            </Button>
            <a href="/" className="text-indigo-600 font-medium">Главная</a>
            <a href="/about" className="text-gray-700 hover:text-indigo-600 transition-colors">О сервисе</a>
            <a href="/admin" className="text-gray-700 hover:text-indigo-600 transition-colors">
              <Icon name="Shield" className="inline mr-1" size={16} />
              Админ
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}