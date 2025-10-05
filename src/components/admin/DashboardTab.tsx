import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface DashboardTabProps {
  filesCount: number;
  pagesCount: number;
}

export default function DashboardTab({ filesCount, pagesCount }: DashboardTabProps) {
  const stats = JSON.parse(localStorage.getItem('question_stats') || '{"total":0,"today":0,"peakHour":"—"}');
  
  const statCards = [
    {
      title: 'Всего вопросов',
      value: stats.total || 0,
      icon: 'MessageSquare',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      title: 'Вопросов сегодня',
      value: stats.today || 0,
      icon: 'TrendingUp',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      title: 'Загруженных файлов',
      value: filesCount,
      icon: 'FileText',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/20 to-emerald-500/20'
    },
    {
      title: 'Созданных страниц',
      value: pagesCount,
      icon: 'FileEdit',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/20 to-red-500/20'
    }
  ];

  const quickActions = [
    { icon: 'Upload', label: 'Загрузить файлы', action: 'files' },
    { icon: 'FileEdit', label: 'Добавить страницу', action: 'content' },
    { icon: 'Settings', label: 'Настройки сайта', action: 'site' },
    { icon: 'BarChart', label: 'Статистика', action: 'stats' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Добро пожаловать в админ-панель! 👋</h2>
          <p className="text-purple-300">Управляйте контентом и следите за статистикой в режиме реального времени</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Card 
            key={idx} 
            className={`p-6 bg-gradient-to-br ${stat.bgGradient} border border-white/10 backdrop-blur-sm hover:scale-105 transition-transform`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <Icon name={stat.icon as any} className="text-white" size={28} />
              </div>
            </div>
            <h3 className="text-purple-200 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-4xl font-bold text-white">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Icon name="Zap" className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Быстрые действия</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group"
              >
                <Icon name={action.icon as any} className="text-purple-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <p className="text-white text-sm font-medium">{action.label}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
              <Icon name="Activity" className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Активность</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <Icon name="Clock" className="text-purple-400" size={18} />
                <span className="text-white">Пиковое время</span>
              </div>
              <span className="text-purple-300 font-semibold">{stats.peakHour}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <Icon name="Users" className="text-purple-400" size={18} />
                <span className="text-white">Статус системы</span>
              </div>
              <span className="text-green-400 font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                Активна
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <Icon name="Database" className="text-purple-400" size={18} />
                <span className="text-white">База данных</span>
              </div>
              <span className="text-green-400 font-semibold">OK</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/50">
            <Icon name="Lightbulb" className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">💡 Подсказка</h3>
            <p className="text-purple-200">
              Используйте раздел "Визуальный редактор" для настройки порядка и видимости блоков на главной странице. 
              Вы можете перетаскивать блоки и включать/выключать их отображение.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
