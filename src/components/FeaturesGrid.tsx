import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function FeaturesGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-12">
      <Card className="p-6 border-2 border-purple-200 text-center hover:shadow-lg transition-shadow">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
          <Icon name="Database" className="text-indigo-600" size={32} />
        </div>
        <h4 className="font-bold text-gray-900 mb-2">База знаний</h4>
        <p className="text-sm text-gray-600">Ответы только по твоим данным</p>
      </Card>

      <Card className="p-6 border-2 border-purple-200 text-center hover:shadow-lg transition-shadow">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
          <Icon name="FileText" className="text-pink-600" size={32} />
        </div>
        <h4 className="font-bold text-gray-900 mb-2">Работа с файлами</h4>
        <p className="text-sm text-gray-600">TXT, JSON, PDF, DOC</p>
      </Card>

      <Card className="p-6 border-2 border-purple-200 text-center hover:shadow-lg transition-shadow">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-100 flex items-center justify-center">
          <Icon name="MessageSquare" className="text-cyan-600" size={32} />
        </div>
        <h4 className="font-bold text-gray-900 mb-2">Умный поиск</h4>
        <p className="text-sm text-gray-600">Находит ответы в документах</p>
      </Card>
    </div>
  );
}