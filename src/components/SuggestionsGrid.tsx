import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface SuggestionsGridProps {
  onSelectSuggestion: (text: string) => void;
}

export default function SuggestionsGrid({ onSelectSuggestion }: SuggestionsGridProps) {
  return (
    <div className="mt-12 mb-8">
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Попробуй спросить</h3>
      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <Card 
          className="p-4 border-2 border-purple-200 hover:border-indigo-400 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => onSelectSuggestion('Объясни квантовую физику простыми словами')}
        >
          <div className="flex items-start gap-3">
            <Icon name="Lightbulb" className="text-yellow-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Объясни квантовую физику простыми словами</p>
              <p className="text-xs text-gray-500 mt-1">Получи понятное объяснение</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 border-2 border-purple-200 hover:border-pink-400 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => onSelectSuggestion('Космический корабль на орбите планеты')}
        >
          <div className="flex items-start gap-3">
            <Icon name="Palette" className="text-pink-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Нарисуй космический корабль</p>
              <p className="text-xs text-gray-500 mt-1">Создай изображение с AI</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 border-2 border-purple-200 hover:border-green-400 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => onSelectSuggestion('Напиши план тренировок на неделю')}
        >
          <div className="flex items-start gap-3">
            <Icon name="ClipboardList" className="text-green-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Составь план тренировок</p>
              <p className="text-xs text-gray-500 mt-1">Персональная программа</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 border-2 border-purple-200 hover:border-orange-400 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => onSelectSuggestion('Какие книги стоит прочитать по психологии?')}
        >
          <div className="flex items-start gap-3">
            <Icon name="BookOpen" className="text-orange-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Посоветуй книги по психологии</p>
              <p className="text-xs text-gray-500 mt-1">Подборка от AI</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
