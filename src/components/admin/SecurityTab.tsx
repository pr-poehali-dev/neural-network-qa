import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleChangePassword = () => {
    const savedPassword = localStorage.getItem('admin_password') || 'admin123';
    
    if (currentPassword !== savedPassword) {
      toast({
        title: 'Ошибка',
        description: 'Текущий пароль неверен',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Пароль должен быть минимум 6 символов',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive'
      });
      return;
    }

    localStorage.setItem('admin_password', newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    toast({
      title: 'Пароль изменён',
      description: 'Используйте новый пароль при следующем входе'
    });
  };

  const currentPasswordStored = localStorage.getItem('admin_password') || 'admin123';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">🔒 Безопасность</h2>
        <p className="text-purple-300">Управляйте паролями и настройками безопасности</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Icon name="Key" className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Смена пароля</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-purple-200 text-sm mb-2 block">Текущий пароль</label>
              <div className="relative">
                <Icon name="Lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-10 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"
                  placeholder="Введите текущий пароль"
                />
              </div>
            </div>

            <div>
              <label className="text-purple-200 text-sm mb-2 block">Новый пароль</label>
              <div className="relative">
                <Icon name="Lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"
                  placeholder="Минимум 6 символов"
                />
              </div>
            </div>

            <div>
              <label className="text-purple-200 text-sm mb-2 block">Подтвердите пароль</label>
              <div className="relative">
                <Icon name="Lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"
                  placeholder="Повторите новый пароль"
                />
              </div>
            </div>

            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-purple-300 hover:text-white text-sm flex items-center gap-2 transition-colors"
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
              {showPassword ? 'Скрыть пароли' : 'Показать пароли'}
            </button>

            <Button
              onClick={handleChangePassword}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/50"
            >
              <Icon name="Check" className="mr-2" size={18} />
              Изменить пароль
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Icon name="Shield" className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Информация о безопасности</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="CheckCircle" className="text-green-400" size={20} />
                <span className="text-white font-semibold">Текущий пароль установлен</span>
              </div>
              <p className="text-purple-200 text-sm">
                Пароль: <code className="bg-white/10 px-2 py-1 rounded">{showPassword ? currentPasswordStored : '••••••••'}</code>
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <Icon name="Info" className="text-purple-400" size={18} />
                Рекомендации
              </h4>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-green-400 mt-0.5" size={16} />
                  Используйте минимум 6 символов
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-green-400 mt-0.5" size={16} />
                  Комбинируйте буквы и цифры
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-green-400 mt-0.5" size={16} />
                  Не используйте простые пароли
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-green-400 mt-0.5" size={16} />
                  Меняйте пароль регулярно
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-start gap-3">
                <Icon name="AlertTriangle" className="text-yellow-400 mt-0.5" size={20} />
                <div>
                  <p className="text-white font-semibold mb-1">Важно!</p>
                  <p className="text-yellow-200 text-sm">
                    Не делитесь паролем с третьими лицами. Пароль хранится локально в браузере.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/50">
            <Icon name="AlertCircle" className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">⚠️ Сброс пароля</h3>
            <p className="text-red-200 mb-4">
              Если вы забыли пароль, удалите данные из localStorage браузера или обратитесь к разработчику.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                if (confirm('Сбросить пароль до "admin123"?')) {
                  localStorage.removeItem('admin_password');
                  toast({
                    title: 'Пароль сброшен',
                    description: 'Используйте "admin123" для входа'
                  });
                }
              }}
              className="border-red-500/50 text-red-300 hover:bg-red-500/20 hover:text-white"
            >
              <Icon name="RotateCcw" className="mr-2" size={18} />
              Сбросить до admin123
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
