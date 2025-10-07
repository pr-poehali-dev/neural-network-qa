import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation onSettingsClick={() => {}} />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzgxODNmNCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Свяжитесь с нами
            </h1>
            <p className="text-xl text-gray-300">
              Мы всегда рады ответить на ваши вопросы
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
              <Icon name="Mail" size={32} className="text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <p className="text-gray-400 text-sm">support@bogdan-ai.com</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
              <Icon name="Phone" size={32} className="text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Телефон</h3>
              <p className="text-gray-400 text-sm">+7 (495) 123-45-67</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
              <Icon name="MapPin" size={32} className="text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Адрес</h3>
              <p className="text-gray-400 text-sm">Санкт-Петербург, Аэропорт Пулково</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Отправить сообщение</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Сообщение</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 outline-none resize-none"
                  rows={5}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
              >
                Отправить
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
