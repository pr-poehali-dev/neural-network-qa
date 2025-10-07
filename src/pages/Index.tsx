import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AIChatButton from '@/components/AIChatButton';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import UserProfile from '@/components/auth/UserProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function Index() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [aiModel, setAiModel] = useState('google/gemini-2.0-flash-exp:free');

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      setUserName(savedName);
    }
    
    const settings = localStorage.getItem('site_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      if (parsed.openrouterApiKey) {
        setApiKey(parsed.openrouterApiKey);
        localStorage.setItem('openrouter_api_key', parsed.openrouterApiKey);
      }
      if (parsed.aiModel) {
        setAiModel(parsed.aiModel);
      }
    }
  }, []);



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
              
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl animate-fade-in-up leading-tight">
                {t.hero.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 font-medium animate-fade-in-up animation-delay-200">
                {t.hero.subtitle}
              </p>
              

            </div>

            <div className="lg:block">
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
                    <Icon name="MessageSquare" size={48} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Начните общение с ИИ</h3>
                  <p className="text-gray-300 mb-3">Умный помощник готов ответить на ваши вопросы</p>
                  {isAuthenticated && user ? (
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-lg">
                        <Icon name="CheckCircle" size={16} className="text-green-400" />
                        <span className="text-sm text-green-300 font-medium">Вы вошли как {user.username}</span>
                      </div>
                      {user.subscription_tier === 'free' && (
                        <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3">
                          <p className="text-xs text-yellow-300">Бесплатный тариф: 10 сообщений/день</p>
                          <Button 
                            size="sm" 
                            onClick={() => setShowProfile(true)}
                            className="mt-2 w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                          >
                            Перейти на PRO
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                        <Icon name="Info" size={16} className="text-blue-400" />
                        <span className="text-sm text-blue-300 font-medium">Войдите для полного доступа</span>
                      </div>
                      <Button 
                        onClick={() => setShowAuthModal(true)}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      >
                        <Icon name="LogIn" size={18} className="mr-2" />
                        Войти или зарегистрироваться
                      </Button>
                    </div>
                  )
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



          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12 text-center mb-16">
            <Icon name="Sparkles" size={48} className="text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Готовы начать?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Присоединяйтесь к тысячам пользователей, которые уже используют Богдан ИИ 
              для решения своих задач. Попробуйте все возможности прямо сейчас!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-6 text-lg"
              >
                <Icon name="User" className="mr-2" size={20} />
                Войти / Регистрация
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

      <AIChatButton apiKey={apiKey} model={aiModel} />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <UserProfile 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />

      <Footer />
    </div>
  );
}