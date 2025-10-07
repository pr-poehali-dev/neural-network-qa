import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';

export default function About() {
  const team = [
    {
      name: 'Богдан Пашков',
      role: 'Создатель и вдохновитель проекта',
      image: 'https://cdn.poehali.dev/files/f544efcc-ed58-4c61-857e-6eb90a748068.png',
      description: 'Основатель проекта "Богдан ИИ". Агент отдела дополнительного обслуживания аэропорта Пулково.',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'bogdan@bogdan-ai.com'
      }
    },
    {
      name: 'Андрей Пашков',
      role: 'Заместитель создателя',
      image: 'https://cdn.poehali.dev/files/87ea466b-a4a1-4746-bc8a-c980f029ba08.png',
      description: 'Сооснователь и технический директор. Агент отдела дополнительного обслуживания аэропорта Пулково.',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'andrey@bogdan-ai.com'
      }
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Рождение идеи',
      description: 'В аэропорту Пулково, помогая пассажирам, мы поняли, что многие вопросы можно решить с помощью ИИ-ассистента.'
    },
    {
      year: '2025 Q1',
      title: 'Первая версия',
      description: 'Запуск MVP с базовыми функциями чата, перевода и обработки файлов.'
    },
    {
      year: '2025 Q2',
      title: 'Расширение функционала',
      description: 'Добавлено 70+ команд, голосовой ввод и интеграция с популярными сервисами.'
    },
    {
      year: 'Будущее',
      title: 'Глобальное развитие',
      description: 'Планы по масштабированию сервиса и выход на международный рынок.'
    }
  ];

  const values = [
    {
      icon: 'Heart',
      title: 'Забота о пользователях',
      description: 'Мы создаем сервис, который действительно помогает людям решать их задачи.'
    },
    {
      icon: 'Zap',
      title: 'Инновации',
      description: 'Используем передовые ИИ-технологии для создания лучших решений.'
    },
    {
      icon: 'Shield',
      title: 'Безопасность',
      description: 'Защита данных пользователей — наш главный приоритет.'
    },
    {
      icon: 'Users',
      title: 'Команда',
      description: 'Профессиональная команда, которая любит свое дело.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation onSettingsClick={() => {}} />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzgxODNmNCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              О нас
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Мы создаем будущее взаимодействия с искусственным интеллектом, 
              делая передовые технологии доступными каждому
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Наша история</h2>
            <div className="space-y-6 text-gray-300">
              <p>
                Проект "Богдан ИИ" родился из реальной потребности людей в умном помощнике, 
                который может решать повседневные задачи быстро и эффективно.
              </p>
              <p>
                Работая агентами отдела дополнительного обслуживания в международном аэропорту Пулково, 
                мы ежедневно сталкивались с сотнями вопросов от пассажиров: от простых переводов до 
                сложных информационных запросов. Мы поняли, что искусственный интеллект может значительно 
                упростить жизнь людей, если сделать его доступным и простым в использовании.
              </p>
              <p>
                Так началась наша миссия — создать универсального ИИ-помощника, который будет полезен 
                каждому: от студента до бизнесмена, от путешественника до исследователя.
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Наши ценности</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all hover:scale-105"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <Icon name={value.icon as any} size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Путь развития</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-purple-400 transition-all"
                >
                  <div className="text-purple-400 font-bold text-lg mb-2">{milestone.year}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{milestone.title}</h3>
                  <p className="text-gray-400 text-sm">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Наша команда</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {team.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-white/30 transition-all hover:scale-105"
                >
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-purple-400 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-400 text-sm mb-4">{member.description}</p>
                    <div className="flex gap-3">
                      <a
                        href={`mailto:${member.social.email}`}
                        className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      >
                        <Icon name="Mail" size={18} className="text-gray-400" />
                      </a>
                      <a
                        href={member.social.linkedin}
                        className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      >
                        <Icon name="Linkedin" size={18} className="text-gray-400" />
                      </a>
                      <a
                        href={member.social.twitter}
                        className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      >
                        <Icon name="Twitter" size={18} className="text-gray-400" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12 text-center">
            <Icon name="Rocket" size={48} className="text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Присоединяйтесь к нам!</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Мы всегда открыты для сотрудничества и новых идей. 
              Если вы разделяете нашу миссию и хотите сделать мир лучше с помощью ИИ-технологий, 
              мы будем рады видеть вас в нашей команде.
            </p>
            <a
              href="mailto:careers@bogdan-ai.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all hover:scale-105"
            >
              <Icon name="Send" size={20} />
              Связаться с нами
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
