import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import AIStatusIndicator from './AIStatusIndicator';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  chatHistoryLength: number;
  onToggleHistory: () => void;
  onOpenSettings: () => void;
  onOpenGamification?: () => void;
  onOpenProfile?: () => void;
  onOpenTools?: () => void;
  userLevel?: number;
  userPoints?: number;
  userName?: string;
  userAvatar?: string;
}

export default function Header({ chatHistoryLength, onToggleHistory, onOpenSettings, onOpenGamification, onOpenProfile, onOpenTools, userLevel, userPoints, userName, userAvatar }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="border-b border-white/20 backdrop-blur-md bg-white/30 dark:bg-gray-900/30 dark:border-gray-700/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Icon name="Brain" className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t('header.title')}
              </h1>
            </div>
            <AIStatusIndicator />
          </div>
          <nav className="flex gap-4 items-center">
            {onOpenProfile && userName && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenProfile}
                className="border-purple-200 dark:border-purple-800 gap-2"
                title="Личный кабинет"
              >
                <span className="text-lg">{userAvatar || '👤'}</span>
                <span className="font-medium">{userName}</span>
              </Button>
            )}
            {onOpenGamification && userLevel !== undefined && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenGamification}
                className="border-purple-200 dark:border-purple-800 gap-2"
                title="Ваш прогресс"
              >
                <span className="text-lg">🎮</span>
                <span className="font-bold">Ур.{userLevel}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{userPoints} 💎</span>
              </Button>
            )}
            {onOpenTools && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenTools}
                className="border-green-200 dark:border-green-800 gap-2"
                title="Инструменты без ИИ"
              >
                <Icon name="Wrench" size={16} />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSettings}
              className="border-purple-200 dark:border-purple-800"
            >
              <Icon name="Settings" size={16} />
            </Button>
            <Link 
              to="/admin" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium hover:from-red-600 hover:to-orange-600 transition-all"
              title="Админ-панель"
            >
              <Icon name="Shield" size={16} />
              <span className="hidden md:inline">Admin</span>
            </Link>
            <Link to="/" className="text-indigo-600 font-medium dark:text-indigo-400">{t('header.home')}</Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition-colors dark:text-gray-300 dark:hover:text-indigo-400">{t('header.about')}</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}