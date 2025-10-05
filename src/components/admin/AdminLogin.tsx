import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = () => {
    if (password === 'admin123') {
      onLogin();
      localStorage.setItem('admin_auth', 'true');
      toast({
        title: "Вход выполнен",
        description: "Добро пожаловать в админ-панель",
      });
    } else {
      toast({
        title: "Ошибка входа",
        description: "Неверный пароль",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Icon name="Lock" className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
        </div>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="border-purple-200"
          />
          <Button 
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Войти
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full border-purple-200"
          >
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            Вернуться на сайт
          </Button>
        </div>
      </Card>
    </div>
  );
}
