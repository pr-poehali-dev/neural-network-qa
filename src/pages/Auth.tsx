import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';

interface AuthPageProps {
  onLogin?: () => void;
}

export default function Auth({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isLogin && password !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (isLogin) {
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          localStorage.setItem('current_user', JSON.stringify(user));
          localStorage.setItem('user_name', user.name);
          toast({
            title: 'Добро пожаловать!',
            description: `Рады видеть вас снова, ${user.name}!`
          });
          onLogin?.();
          window.location.href = '/';
        } else {
          toast({
            title: 'Ошибка входа',
            description: 'Неверный email или пароль',
            variant: 'destructive'
          });
        }
      } else {
        const existingUser = users.find((u: any) => u.email === email);
        
        if (existingUser) {
          toast({
            title: 'Ошибка',
            description: 'Пользователь с таким email уже существует',
            variant: 'destructive'
          });
        } else {
          const newUser = {
            id: Date.now().toString(),
            email,
            name,
            password,
            createdAt: new Date().toISOString()
          };
          
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('current_user', JSON.stringify(newUser));
          localStorage.setItem('user_name', name);
          
          toast({
            title: 'Регистрация успешна!',
            description: `Добро пожаловать, ${name}!`
          });
          
          onLogin?.();
          window.location.href = '/';
        }
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzgxODNmNCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
      
      <Card className="relative z-10 w-full max-w-md p-8 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <Logo size={60} showText={false} className="mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {isLogin ? 'Вход в систему' : 'Регистрация'}
          </h1>
          <p className="text-gray-400 mt-2 text-center">
            {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Имя</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите ваше имя"
                required
                className="bg-white/5 border-white/10 text-white placeholder-gray-500"
              />
            </div>
          )}

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              required
              className="bg-white/5 border-white/10 text-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Пароль</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-white/5 border-white/10 text-white placeholder-gray-500"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Подтвердите пароль</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-white/5 border-white/10 text-white placeholder-gray-500"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6"
          >
            {isLoading ? (
              <Icon name="Loader2" className="animate-spin" size={20} />
            ) : (
              <>
                <Icon name={isLogin ? 'LogIn' : 'UserPlus'} className="mr-2" size={20} />
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            <Icon name="Home" className="mr-2" size={18} />
            На главную
          </Button>
        </div>
      </Card>
    </div>
  );
}
