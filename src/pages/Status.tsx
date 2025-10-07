import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';

export default function Status() {
  const services = [
    { name: 'Веб-сайт', status: 'operational', uptime: '99.9%', color: 'text-green-400' },
    { name: 'API Сервис', status: 'operational', uptime: '99.8%', color: 'text-green-400' },
    { name: 'Чат-бот', status: 'operational', uptime: '100%', color: 'text-green-400' },
    { name: 'База данных', status: 'operational', uptime: '99.95%', color: 'text-green-400' },
    { name: 'Файловое хранилище', status: 'operational', uptime: '99.7%', color: 'text-green-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation onSettingsClick={() => {}} />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzgxODNmNCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Все системы работают нормально</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Статус сервиса
            </h1>
            <p className="text-xl text-gray-300">
              Мониторинг работы всех компонентов системы в реальном времени
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Компоненты системы</h2>
            <div className="space-y-4">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="Check" size={20} className={service.color} />
                    <span className="text-white font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-gray-400 text-sm">Uptime: {service.uptime}</span>
                    <span className={`${service.color} font-medium`}>Работает</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="Activity" size={24} className="text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Производительность</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Время отклика API</span>
                    <span className="text-white">45ms</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Загрузка процессора</span>
                    <span className="text-white">32%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="Users" size={24} className="text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Активность</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Активных пользователей</span>
                  <span className="text-white font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Запросов за час</span>
                  <span className="text-white font-semibold">12,450</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
