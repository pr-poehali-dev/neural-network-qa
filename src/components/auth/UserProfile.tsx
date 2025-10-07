import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'subscription'>('profile');

  if (!isOpen || !user) return null;

  const subscriptionTiers = {
    free: { name: 'Бесплатный', color: 'gray', limit: '10 сообщений/день' },
    pro: { name: 'PRO', color: 'orange', limit: '1000 сообщений/день', price: '$9.99/мес' },
    enterprise: { name: 'Enterprise', color: 'purple', limit: 'Безлимит', price: 'По договоренности' }
  };

  const currentTier = subscriptionTiers[user.subscription_tier];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <Icon name="X" size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
              {user.avatar_url || '👤'}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-white/80">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${currentTier.color}-500`}>
                  {currentTier.name}
                </span>
                {user.is_verified && (
                  <span className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                    <Icon name="CheckCircle" size={14} />
                    Подтвержден
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-3 font-medium ${
                activeTab === 'profile'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon name="User" size={18} className="inline mr-2" />
              Профиль
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 px-6 py-3 font-medium ${
                activeTab === 'stats'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon name="BarChart3" size={18} className="inline mr-2" />
              Статистика
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`flex-1 px-6 py-3 font-medium ${
                activeTab === 'subscription'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon name="CreditCard" size={18} className="inline mr-2" />
              Подписка
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Полное имя
                </label>
                <input
                  type="text"
                  defaultValue={user.full_name || ''}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  placeholder="Введите ваше имя"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Имя пользователя
                </label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500"
                />
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Сохранить изменения
              </Button>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl">
                  <div className="text-3xl mb-2">💬</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Сообщений отправлено</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">1</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Уровень</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-xl">
                  <div className="text-3xl mb-2">💎</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Опыта</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">10</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Лимит сегодня</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Текущий тариф: {currentTier.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {currentTier.limit}
                </p>
                {user.subscription_tier === 'free' && (
                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                      <Icon name="Zap" size={18} className="mr-2" />
                      Перейти на PRO ($9.99/мес)
                    </Button>
                    <Button variant="outline" className="w-full border-purple-300 dark:border-purple-700">
                      <Icon name="Building" size={18} className="mr-2" />
                      Enterprise для бизнеса
                    </Button>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Сравнение тарифов</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-gray-600 dark:text-gray-400">Сообщений в день</span>
                    <span className="font-medium">10 → 1000 → ∞</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-gray-600 dark:text-gray-400">Все модели AI</span>
                    <span className="font-medium">✓ PRO и Enterprise</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-gray-600 dark:text-gray-400">История навсегда</span>
                    <span className="font-medium">✓ PRO и Enterprise</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">API доступ</span>
                    <span className="font-medium">✓ Enterprise</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 p-6">
          <Button
            variant="outline"
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
          >
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти из аккаунта
          </Button>
        </div>
      </div>
    </div>
  );
}
