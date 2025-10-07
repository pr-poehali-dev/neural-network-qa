import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

export default function Docs() {
  const documents = [
    {
      title: 'Политика конфиденциальности',
      description: 'Узнайте, как мы собираем, используем и защищаем ваши данные',
      icon: 'Shield',
      href: '/privacy',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Условия использования',
      description: 'Правила и условия использования нашего сервиса',
      icon: 'FileText',
      href: '/terms',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Лицензионное соглашение',
      description: 'Информация о лицензировании программного обеспечения',
      icon: 'Award',
      href: '/license',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Обработка данных',
      description: 'Как обрабатываются ваши персональные данные',
      icon: 'Database',
      href: '/data-processing',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Документация API',
      description: 'Техническая документация для разработчиков',
      icon: 'Code',
      href: '/api-docs',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Руководство пользователя',
      description: 'Полное руководство по использованию всех функций',
      icon: 'BookOpen',
      href: '/user-guide',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation onSettingsClick={() => {}} />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzgxODNmNCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Документация
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Вся необходимая информация о нашем сервисе, политиках и условиях использования
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {documents.map((doc, idx) => (
              <Link
                key={idx}
                to={doc.href}
                className="group bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:bg-white/10"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${doc.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon name={doc.icon as any} className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{doc.title}</h3>
                <p className="text-gray-400 text-sm">{doc.description}</p>
                <div className="mt-4 flex items-center text-purple-400 text-sm font-medium">
                  Читать далее
                  <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
