import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4zIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      
      <Card className="w-full max-w-md p-10 border border-purple-500/30 bg-black/40 backdrop-blur-xl relative z-10 shadow-2xl shadow-purple-500/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50">
            <Icon name="Lock" className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Панель управления</h1>
          <p className="text-purple-300">Введите пароль для доступа</p>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <Icon name="Key" className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
            <Input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="pl-10 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-500"
            />
          </div>
          <Button 
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/50"
          >
            <Icon name="LogIn" className="mr-2" size={18} />
            Войти
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate('/')}
            className="w-full text-purple-300 hover:text-white hover:bg-white/10"
          >
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            Вернуться на сайт
          </Button>
        </div>
      </Card>
    </div>
  );
}