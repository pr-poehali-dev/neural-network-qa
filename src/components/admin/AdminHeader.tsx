import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <header className="border-b border-purple-500/30 backdrop-blur-xl bg-black/20">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Icon name="Shield" className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Админ-панель
              </h1>
              <p className="text-purple-300 text-sm">Богдан AI</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-purple-200 hover:text-white hover:bg-white/10"
            >
              <Icon name="Home" className="mr-2" size={18} />
              На главную
            </Button>
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="text-purple-200 hover:text-white hover:bg-red-500/20 hover:text-red-300"
            >
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}