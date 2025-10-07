import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { AdminTabType } from '@/types/adminTypes';

interface AdminTabNavigationProps {
  activeTab: AdminTabType;
  onTabChange: (tab: AdminTabType) => void;
}

interface TabConfig {
  id: AdminTabType;
  icon: string;
  label: string;
  gradient?: string;
}

const tabs: TabConfig[] = [
  { id: 'dashboard', icon: 'LayoutDashboard', label: 'Дашборд' },
  { id: 'site', icon: 'Globe', label: 'Настройки сайта' },
  { id: 'content', icon: 'FileEdit', label: 'Контент' },
  { id: 'files', icon: 'FileText', label: 'Файлы' },
  { id: 'stats', icon: 'BarChart', label: 'Статистика' },
  { id: 'buttons', icon: 'Zap', label: 'Быстрые кнопки' },
  { id: 'analytics', icon: 'TrendingUp', label: 'Аналитика' },
  { id: 'voice', icon: 'Mic', label: 'Озвучка' },
  { id: 'control', icon: 'Shield', label: 'Полный контроль', gradient: 'from-red-500 to-orange-500 shadow-red-500/50' },
  { id: 'visual', icon: 'Layers', label: 'Визуальный редактор', gradient: 'from-green-500 to-emerald-500 shadow-green-500/50' },
  { id: 'security', icon: 'Lock', label: 'Безопасность', gradient: 'from-indigo-500 to-purple-500 shadow-indigo-500/50' },
  { id: 'languages', icon: 'Globe', label: 'Языки', gradient: 'from-blue-500 to-cyan-500 shadow-blue-500/50' }
];

export default function AdminTabNavigation({ activeTab, onTabChange }: AdminTabNavigationProps) {
  return (
    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const gradient = tab.gradient || 'from-purple-600 to-pink-600 shadow-purple-500/50';
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? 'default' : 'ghost'}
            onClick={() => onTabChange(tab.id)}
            className={`transition-all whitespace-nowrap ${
              isActive 
                ? `bg-gradient-to-r ${gradient} text-white shadow-lg` 
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon name={tab.icon as any} className="mr-2" size={18} />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
