import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function FeaturesGrid() {
  return (
    <div className="grid md:grid-cols-4 gap-6 mt-12">
      <Card className="p-6 border-2 border-purple-200 text-center hover:shadow-lg transition-shadow">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
          <Icon name="Zap" className="text-indigo-600" size={32} />
        </div>
        <h4 className="font-bold text-gray-900 mb-2">Быстрые ответы</h4>
        <p className="text-sm text-gray-600">Мгновенный анализ и результаты</p>
      </Card>

      <Card className="p-6 border-2 border-purple-200 text-center hover:shadow-lg transition-shadow">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
          <Icon name="Image" className="text-pink-600" size={32} />
        </div>
        <h4 className="font-bold text-gray-900 mb-2">Генерация изображений</h4>
        <p className="text-sm text-gray-600">Создавай картинки по описанию</p>
      </Card>

      <Card className="p-6 border-2 border-purple-200 text-center hover:shadow-lg transition-shadow">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <Icon name="FileText" className="text-green-600" size={32} />
        </div>
        <h4 className="font-bold text-gray-900 mb-2">Анализ документов</h4>
        <p className="text-sm text-gray-600">Загружай файлы через админку</p>
      </Card>

      <Card className="p-6 border-2 border-purple-200 text-center hover:shadow-lg transition-shadow">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-100 flex items-center justify-center">
          <Icon name="Brain" className="text-cyan-600" size={32} />
        </div>
        <h4 className="font-bold text-gray-900 mb-2">Grok AI</h4>
        <p className="text-sm text-gray-600">Мощная языковая модель от X.AI</p>
      </Card>
    </div>
  );
}
