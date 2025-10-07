import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import AIStatusIndicator from './AIStatusIndicator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import AuthModal from './auth/AuthModal';

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
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 relative z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Icon name="Brain" className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                {t('header.title')}
              </h1>
            </Link>
            <AIStatusIndicator />
          </div>
          
          <nav className="flex gap-2 items-center flex-wrap justify-end">
            {isAuthenticated && user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenProfile}
                  className="border-purple-200 dark:border-purple-800 gap-2 hover:bg-purple-50 dark:hover:bg-purple-950"
                  title="Личный кабинет"
                >
                  <span className="text-lg">{user.avatar_url || '👤'}</span>
                  <span className="font-medium">{user.username}</span>
                  {user.subscription_tier === 'pro' && <span className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-0.5 rounded-full">PRO</span>}
                  {user.subscription_tier === 'enterprise' && <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full">ENT</span>}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                  title="Выйти"
                >
                  <Icon name="LogOut" size={16} />
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white gap-2"
              >
                <Icon name="LogIn" size={16} />
                <span className="hidden sm:inline">Войти</span>
              </Button>
            )}
            {onOpenProfile && userName && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenProfile}
                className="border-purple-200 dark:border-purple-800 gap-2 hover:bg-purple-50 dark:hover:bg-purple-950"
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
                className="border-purple-200 dark:border-purple-800 gap-2 hover:bg-purple-50 dark:hover:bg-purple-950"
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
                className="border-green-200 dark:border-green-800 gap-2 hover:bg-green-50 dark:hover:bg-green-950"
                title="Инструменты без ИИ"
              >
                <Icon name="Wrench" size={16} />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSettings}
              className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              title="Настройки"
            >
              <Icon name="Settings" size={16} />
            </Button>
            <Link 
              to="/admin" 
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium hover:from-red-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
              title="Админ-панель"
            >
              <Icon name="Shield" size={16} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
            <Link to="/about" className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors dark:text-gray-300 dark:hover:text-indigo-400 text-sm font-medium whitespace-nowrap">{t('header.about')}</Link>
          </nav>
        </div>
      </div>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
}