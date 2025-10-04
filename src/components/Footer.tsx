import Icon from '@/components/ui/icon';

export default function Footer() {
  return (
    <footer className="border-t border-purple-200 mt-20 py-12 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Icon name="Brain" className="text-white" size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Богдан AI</p>
              <p className="text-sm text-gray-600">Умный помощник нового поколения</p>
            </div>
          </div>
          <div className="flex gap-8">
            <a href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Главная</a>
            <a href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">О сервисе</a>
            <a href="/admin" className="text-gray-600 hover:text-indigo-600 transition-colors">Админ</a>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t border-purple-100">
          © 2024 Богдан AI. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
