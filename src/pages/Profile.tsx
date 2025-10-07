import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = localStorage.getItem('current_user');
    if (!currentUser) {
      window.location.href = '/auth';
      return;
    }
    
    const userData = JSON.parse(currentUser);
    setUser(userData);
    setName(userData.name);
    setEmail(userData.email);
  }, []);

  const handleSave = () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive'
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.id === user.id) {
        return {
          ...u,
          name,
          email,
          password: newPassword || u.password
        };
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    const updatedUser = updatedUsers.find((u: any) => u.id === user.id);
    localStorage.setItem('current_user', JSON.stringify(updatedUser));
    localStorage.setItem('user_name', name);
    
    setUser(updatedUser);
    setIsEditing(false);
    setNewPassword('');
    setConfirmPassword('');
    
    toast({
      title: 'Профиль обновлён',
      description: 'Ваши данные успешно сохранены'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    toast({
      title: 'Вы вышли из системы',
      description: 'До скорой встречи!'
    });
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-white" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation onSettingsClick={() => {}} />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzgxODNmNCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Личный кабинет
            </h1>
            <p className="text-xl text-gray-300">
              Управляйте своим профилем и настройками
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="p-8 bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Icon name="User" size={40} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    <p className="text-gray-400">{user.email}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Icon name={isEditing ? 'X' : 'Edit'} className="mr-2" size={18} />
                  {isEditing ? 'Отмена' : 'Редактировать'}
                </Button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Имя</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="border-t border-white/10 pt-4 mt-6">
                    <h3 className="text-white font-semibold mb-4">Изменить пароль</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-300 mb-2 block">Новый пароль</label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Оставьте пустым, чтобы не менять"
                          className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-300 mb-2 block">Подтвердите пароль</label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Повторите новый пароль"
                          className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 mt-6"
                  >
                    <Icon name="Save" className="mr-2" size={18} />
                    Сохранить изменения
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" size={18} className="text-purple-400" />
                    <span>Зарегистрирован: {new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Mail" size={18} className="text-purple-400" />
                    <span>{user.email}</span>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-8 bg-white/5 backdrop-blur-md border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Быстрые действия</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="border-white/20 text-white hover:bg-white/10 justify-start"
                >
                  <Icon name="Home" className="mr-2" size={18} />
                  На главную
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/admin'}
                  className="border-white/20 text-white hover:bg-white/10 justify-start"
                >
                  <Icon name="Settings" className="mr-2" size={18} />
                  Админ-панель
                </Button>
              </div>
            </Card>

            <Card className="p-8 bg-red-900/20 backdrop-blur-md border border-red-500/30">
              <h3 className="text-xl font-bold text-red-400 mb-4">Опасная зона</h3>
              <p className="text-gray-300 mb-4">
                Выйдите из системы. Вы сможете войти снова используя свой email и пароль.
              </p>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-900/30"
              >
                <Icon name="LogOut" className="mr-2" size={18} />
                Выйти из системы
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
