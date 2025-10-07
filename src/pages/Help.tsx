import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';

export default function Help() {
  const helpTopics = [
    {
      icon: 'MessageSquare',
      title: 'Как начать использовать чат?',
      content: 'Нажмите кнопку "Начать работу" на главной странице. При первом запуске введите своё имя для персонализации общения. Для полного функционала чата настройте API-ключ в админ-панели.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'Key',
      title: 'Как подключить API-ключ?',
      content: 'Войдите в админ-панель (кнопка настроек в шапке, пароль: bogdan2025), перейдите в раздел "Настройки сайта" и добавьте ваш OpenRouter API-ключ.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'Mic',
      title: 'Как работает голосовой ввод?',
      content: 'Нажмите на иконку микрофона в чате, разрешите доступ к микрофону в браузере и начните говорить. ИИ автоматически распознает вашу речь.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: 'FileText',
      title: 'Какие файлы можно загружать?',
      content: 'Поддерживаются текстовые файлы (.txt, .md, .json), изображения (.jpg, .png, .webp) и PDF-документы. Максимальный размер файла: 10 МБ.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: 'Globe',
      title: 'Поддержка языков',
      content: 'Богдан ИИ поддерживает более 50 языков для перевода. Используйте команды вида "/translate en" для перевода на английский язык.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: 'Shield',
      title: 'Безопасность данных',
      content: 'Все ваши данные защищены современными методами шифрования. Мы не передаём ваши личные данные третьим лицам без вашего согласия.',
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
              Центр помощи
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ответы на часто задаваемые вопросы и инструкции по использованию
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {helpTopics.map((topic, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${topic.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon name={topic.icon as any} size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{topic.title}</h3>
                <p className="text-gray-400 text-sm">{topic.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12 text-center max-w-3xl mx-auto">
            <Icon name="HelpCircle" size={48} className="text-purple-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Не нашли ответ на свой вопрос?</h2>
            <p className="text-gray-300 mb-6">
              Свяжитесь с нашей службой поддержки, и мы поможем вам решить любую проблему
            </p>
            <a
              href="/support"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all hover:scale-105"
            >
              <Icon name="MessageSquare" size={20} />
              Связаться с поддержкой
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
