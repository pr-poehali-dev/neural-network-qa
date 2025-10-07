import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Спасибо за обращение! Мы ответим в ближайшее время.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const faqItems = [
    {
      q: 'Как начать использовать сервис?',
      a: 'Нажмите на кнопку настроек в правом верхнем углу и введите пароль для входа в админ-панель.'
    },
    {
      q: 'Какие команды поддерживает ИИ?',
      a: 'Наш ИИ поддерживает более 70 команд для работы с текстом, переводом, файлами и другими задачами.'
    },
    {
      q: 'Безопасны ли мои данные?',
      a: 'Да, мы используем шифрование и не передаем ваши данные третьим лицам. Подробнее в Политике конфиденциальности.'
    },
    {
      q: 'Как работает голосовой ввод?',
      a: 'Нажмите на иконку микрофона в чате, разрешите доступ к микрофону и начните говорить.'
    },
    {
      q: 'Какие файлы можно загружать?',
      a: 'Поддерживаются текстовые файлы, изображения, PDF и другие форматы. Максимальный размер: 10 МБ.'
    }
  ];

  const contactMethods = [
    {
      icon: 'Mail',
      title: 'Email',
      value: 'support@bogdan-ai.com',
      description: 'Ответим в течение 24 часов',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'MessageSquare',
      title: 'Онлайн-чат',
      value: 'Доступен 24/7',
      description: 'Мгновенные ответы',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: 'Phone',
      title: 'Телефон',
      value: '+7 (495) 123-45-67',
      description: 'Пн-Пт с 9:00 до 18:00',
      color: 'from-purple-500 to-pink-500'
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
              Центр поддержки
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Мы здесь, чтобы помочь вам. Выберите удобный способ связи
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
            {contactMethods.map((method, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon name={method.icon as any} size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{method.title}</h3>
                <p className="text-purple-400 font-medium mb-1">{method.value}</p>
                <p className="text-gray-400 text-sm">{method.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Часто задаваемые вопросы</h2>
              <div className="space-y-4">
                {faqItems.map((item, idx) => (
                  <div key={idx} className="border-b border-white/10 pb-4 last:border-0">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-start gap-2">
                      <Icon name="HelpCircle" size={20} className="text-purple-400 mt-0.5 flex-shrink-0" />
                      {item.q}
                    </h3>
                    <p className="text-gray-400 ml-7">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Свяжитесь с нами</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 outline-none transition-colors"
                    placeholder="Ваше имя"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 outline-none transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Тема</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 outline-none transition-colors"
                    placeholder="Кратко о вашем вопросе"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Сообщение</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 outline-none transition-colors resize-none"
                    placeholder="Опишите вашу проблему или вопрос..."
                    rows={5}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
                >
                  Отправить сообщение
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
