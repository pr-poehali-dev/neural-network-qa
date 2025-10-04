import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AITool {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  prompt: string;
}

interface AIToolsPanelProps {
  onSelectTool: (prompt: string) => void;
}

const AI_TOOLS: AITool[] = [
  {
    id: 'essay',
    title: 'Реферат/Эссе',
    description: 'Напишу структурированный текст по теме',
    icon: 'FileText',
    color: 'border-blue-400 hover:bg-blue-50',
    prompt: 'Напиши подробный реферат на тему: '
  },
  {
    id: 'grammar',
    title: 'Исправление текста',
    description: 'Проверю грамматику и улучшу стиль',
    icon: 'CheckCircle',
    color: 'border-green-400 hover:bg-green-50',
    prompt: 'Исправь грамматику и улучши стиль следующего текста: '
  },
  {
    id: 'translate',
    title: 'Перевод',
    description: 'Переведу на любой язык качественно',
    icon: 'Languages',
    color: 'border-purple-400 hover:bg-purple-50',
    prompt: 'Переведи на английский следующий текст: '
  },
  {
    id: 'summary',
    title: 'Краткое содержание',
    description: 'Сделаю краткую выжимку текста',
    icon: 'FileDown',
    color: 'border-orange-400 hover:bg-orange-50',
    prompt: 'Сделай краткое содержание следующего текста: '
  },
  {
    id: 'brainstorm',
    title: 'Генерация идей',
    description: 'Помогу с креативными идеями',
    icon: 'Lightbulb',
    color: 'border-yellow-400 hover:bg-yellow-50',
    prompt: 'Предложи креативные идеи для: '
  },
  {
    id: 'math',
    title: 'Решение задач',
    description: 'Решу математические задачи',
    icon: 'Calculator',
    color: 'border-cyan-400 hover:bg-cyan-50',
    prompt: 'Реши следующую математическую задачу с подробным объяснением: '
  },
  {
    id: 'code',
    title: 'Помощь с кодом',
    description: 'Объясню код или напишу новый',
    icon: 'Code',
    color: 'border-indigo-400 hover:bg-indigo-50',
    prompt: 'Помоги с кодом: '
  },
  {
    id: 'letter',
    title: 'Написание письма',
    description: 'Составлю деловое или личное письмо',
    icon: 'Mail',
    color: 'border-pink-400 hover:bg-pink-50',
    prompt: 'Напиши письмо на тему: '
  }
];

export default function AIToolsPanel({ onSelectTool }: AIToolsPanelProps) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Icon name="Wrench" className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Инструменты AI</h3>
          <p className="text-sm text-gray-600">Выбери готовый инструмент для задачи</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        {AI_TOOLS.map(tool => (
          <Card 
            key={tool.id}
            className={`p-4 border-2 ${tool.color} cursor-pointer transition-all hover:shadow-md`}
            onClick={() => onSelectTool(tool.prompt)}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon name={tool.icon as any} className="text-gray-700" size={20} />
                <h4 className="font-semibold text-sm text-gray-900">{tool.title}</h4>
              </div>
              <p className="text-xs text-gray-600">{tool.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
