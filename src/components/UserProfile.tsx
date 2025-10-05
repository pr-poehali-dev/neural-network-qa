import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface UserData {
  name: string;
  email: string;
  phone: string;
  company: string;
  avatar: string;
  registeredAt: string;
}

interface UserProfileProps {
  onClose: () => void;
}

const AVATAR_EMOJIS = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '🧑‍💼', '🦸', '🦸‍♀️', '🧙', '🧙‍♀️', '🎅', '🤴', '👸'];

export default function UserProfile({ onClose }: UserProfileProps) {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    avatar: '👤',
    registeredAt: new Date().toISOString(),
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('userData');
    if (saved) {
      setUserData(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsEditing(false);
  };

  const handleChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const registeredDays = Math.floor((Date.now() - new Date(userData.registeredAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 border-2 border-purple-200 dark:border-purple-800 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Icon name="User" className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Личный кабинет</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Avatar Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Аватар
          </label>
          <div className="flex gap-2 flex-wrap">
            {AVATAR_EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => handleChange('avatar', emoji)}
                className={`text-3xl w-12 h-12 rounded-lg transition-all ${
                  userData.avatar === emoji
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 scale-110'
                    : 'bg-gray-100 dark:bg-gray-800 hover:scale-105'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Имя *
            </label>
            <Input
              value={userData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Введите ваше имя"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={userData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="example@mail.com"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Телефон
            </label>
            <Input
              type="tel"
              value={userData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+7 (999) 123-45-67"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Компания
            </label>
            <Input
              value={userData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Название компании"
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-800">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{registeredDays}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">дней с нами</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
            <div className="text-center">
              <div className="text-3xl">{userData.avatar}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ваш аватар</div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                <Icon name="Check" size={20} className="mr-2" />
                Сохранить
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="flex-1"
              >
                <Icon name="X" size={20} className="mr-2" />
                Отмена
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              <Icon name="Edit" size={20} className="mr-2" />
              Редактировать
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
