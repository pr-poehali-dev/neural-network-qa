import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function Index() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleStartChat = () => {
    const savedName = localStorage.getItem('user_name');
    if (!savedName) {
      setShowNamePrompt(true);
    } else {
      setShowChat(true);
    }
  };

  const handleSaveName = (name: string) => {
    localStorage.setItem('user_name', name);
    setUserName(name);
    setShowNamePrompt(false);
    setShowChat(true);
  };

  const ADMIN_PASSWORD = 'bogdan2025';

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      localStorage.setItem('admin_session', 'true');
      setShowAdminPrompt(false);
      window.location.href = '/admin';
    } else {
      toast({
        title: 'Неверный пароль!',
        variant: 'destructive'
      });
      setAdminPassword('');
    }
  };

  const features = [
    { 
      icon: 'MessageSquare', 
      title: t.features.chat.title, 
      desc: t.features.chat.description, 
      gradient: 'from-blue-500 to-cyan-500' 
    },
    { 
      icon: 'Globe', 
      title: t.features.translate.title, 
      desc: t.features.translate.description, 
      gradient: 'from-purple-500 to-pink-500' 
    },
    { 
      icon: 'Mic', 
      title: t.features.voice.title, 
      desc: t.features.voice.description, 
      gradient: 'from-orange-500 to-red-500' 
    },
    { 
      icon: 'FileText', 
      title: t.features.files.title, 
      desc: t.features.files.description, 
      gradient: 'from-green-500 to-emerald-500' 
    },
    { 
      icon: 'Zap', 
      title: t.features.commands.title, 
      desc: t.features.commands.description, 
      gradient: 'from-indigo-500 to-purple-500' 
    },
    { 
      icon: 'Shield', 
      title: t.features.security.title, 
      desc: t.features.security.description, 
      gradient: 'from-teal-500 to-cyan-500' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Navigation onSettingsClick={() => setShowAdminPrompt(true)} />
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzgxODNmNCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {showAdminPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-gray-700">
            <h3 className="text-white font-semibold mb-4">Вход в админ-панель</h3>
            <input 
              type="password" 
              value={adminPassword} 
              onChange={(e) => setAdminPassword(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} 
              placeholder="Введите пароль" 
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg mb-4 border border-gray-600 focus:border-indigo-500 outline-none" 
            />
            <div className="flex gap-2">
              <Button onClick={handleAdminLogin} className="flex-1 bg-indigo-600 hover:bg-indigo-700">Войти</Button>
              <Button onClick={() => { setShowAdminPrompt(false); setAdminPassword(''); }} variant="outline" className="flex-1">Отмена</Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="relative z-10 pt-16">
        <main className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-block mb-4">
                <Logo size={80} showText={false} />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                {t.hero.title}
              </h1>
              
              <p className="text-xl text-gray-200 font-medium">
                {t.hero.subtitle}
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/40 rounded-full text-sm text-white font-medium backdrop-blur-sm">
                  ✨ 70+ {t.chat.commands}
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-400/40 rounded-full text-sm text-white font-medium backdrop-blur-sm">
                  🌍 {t.translator.subtitle}
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-pink-500/30 to-rose-500/30 border border-pink-400/40 rounded-full text-sm text-white font-medium backdrop-blur-sm">
                  ⚡ {t.hero.openChat}
                </span>
              </div>
            </div>

            <div className="lg:block">
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
                    <Icon name="MessageSquare" size={48} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Начните общение с ИИ</h3>
                  <p className="text-gray-300">Умный помощник готов ответить на ваши вопросы</p>
                  <Button
                    onClick={handleStartChat}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 text-lg"
                  >
                    <Icon name="Sparkles" className="mr-2" size={20} />
                    Открыть чат
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div id="features" className="mb-16">
            <h2 className="text-3xl font-bold text-center text-white mb-4">{t.features.title}</h2>
            <p className="text-gray-400 text-center mb-8">{t.features.subtitle}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((item, idx) => (
                <div 
                  key={idx} 
                  className="group bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:bg-white/10 cursor-pointer"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon name={item.icon as any} className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md rounded-2xl border border-blue-400/20 p-8 text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  70+
                </div>
                <p className="text-gray-300 font-medium">Команд для работы</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-2xl border border-purple-400/20 p-8 text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <p className="text-gray-300 font-medium">Доступность сервиса</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-md rounded-2xl border border-green-400/20 p-8 text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <p className="text-gray-300 font-medium">Безопасность данных</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12 text-center mb-16">
            <Icon name="Sparkles" size={48} className="text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Готовы начать?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Присоединяйтесь к тысячам пользователей, которые уже используют Богдан ИИ 
              для решения своих задач. Попробуйте все возможности прямо сейчас!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={handleStartChat}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-6 text-lg"
              >
                <Icon name="MessageSquare" className="mr-2" size={20} />
                Начать работу
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/about'}
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                <Icon name="Users" className="mr-2" size={20} />
                Узнать больше
              </Button>
            </div>
          </div>
        </main>
      </div>

      {showNamePrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
                <Icon name="User" size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Добро пожаловать!</h3>
              <p className="text-gray-300">Как к вам обращаться?</p>
            </div>
            <input 
              type="text" 
              placeholder="Введите ваше имя" 
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 outline-none mb-4"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                  handleSaveName((e.target as HTMLInputElement).value.trim());
                }
              }}
              autoFocus
            />
            <Button 
              onClick={(e) => {
                const input = e.currentTarget.parentElement?.querySelector('input');
                if (input?.value.trim()) {
                  handleSaveName(input.value.trim());
                }
              }}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3"
            >
              Продолжить
            </Button>
          </div>
        </div>
      )}

      {showChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-4xl w-full h-[80vh] border border-purple-500/30 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Icon name="Bot" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Богдан ИИ</h3>
                  <p className="text-xs text-gray-400">Здравствуйте, {userName}!</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                <Icon name="X" size={20} className="text-gray-400" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-center text-gray-400 py-12">
                <Icon name="MessageSquare" size={64} className="mx-auto mb-4 text-purple-400" />
                <p className="mb-2">Чат готов к работе</p>
                <p className="text-sm">Для полного функционала настройте API-ключ в админ-панели</p>
              </div>
            </div>
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Напишите сообщение..." 
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 outline-none"
                />
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}