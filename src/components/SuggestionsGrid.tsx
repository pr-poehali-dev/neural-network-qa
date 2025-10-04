import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface SuggestionsGridProps {
  onSelectSuggestion: (text: string) => void;
}

export default function SuggestionsGrid({ onSelectSuggestion }: SuggestionsGridProps) {
  return (
    <div className="mt-12 mb-8">
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Примеры вопросов</h3>
      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <Card 
          className="p-4 border-2 border-purple-200 hover:border-indigo-400 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => onSelectSuggestion('Что говорится в документе о ценах?')}
        >
          <div className="flex items-start gap-3">
            <Icon name="Search" className="text-indigo-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Что говорится о ценах?</p>
              <p className="text-xs text-gray-500 mt-1">Поиск по документам</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 border-2 border-purple-200 hover:border-pink-400 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => onSelectSuggestion('Какие контакты указаны в файле?')}
        >
          <div className="flex items-start gap-3">
            <Icon name="Phone" className="text-pink-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Какие контакты есть?</p>
              <p className="text-xs text-gray-500 mt-1">Извлечение данных</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 border-2 border-purple-200 hover:border-green-400 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => onSelectSuggestion('Сделай краткое содержание документа')}
        >
          <div className="flex items-start gap-3">
            <Icon name="FileText" className="text-green-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Кратко перескажи</p>
              <p className="text-xs text-gray-500 mt-1">Резюме документа</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 border-2 border-purple-200 hover:border-orange-400 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => onSelectSuggestion('Перечисли все упомянутые даты')}
        >
          <div className="flex items-start gap-3">
            <Icon name="Calendar" className="text-orange-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Найди все даты</p>
              <p className="text-xs text-gray-500 mt-1">Извлечение дат</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}