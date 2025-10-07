import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SpecialCommand {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
  color: string;
  category: 'text' | 'business' | 'code' | 'creative' | 'analysis';
}

const SPECIAL_COMMANDS: SpecialCommand[] = [
  // Текстовые команды
  {
    id: 'article',
    title: 'Статья для блога',
    description: 'Создам SEO-оптимизированную статью',
    icon: 'FileText',
    prompt: 'Напиши подробную SEO-оптимизированную статью на тему: [ТЕМА]. Включи: введение, основную часть с подзаголовками, заключение, призыв к действию. Объем: 1500-2000 слов.',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'email',
    title: 'Email-письмо',
    description: 'Коммерческое или личное письмо',
    icon: 'Mail',
    prompt: 'Напиши профессиональное email-письмо на тему: [ТЕМА]. Учти тон, структуру (приветствие, основная часть, призыв к действию, подпись).',
    color: 'from-purple-500 to-pink-500',
    category: 'text'
  },
  {
    id: 'social',
    title: 'Посты для соцсетей',
    description: '10 постов для Instagram, VK, Telegram',
    icon: 'MessageCircle',
    prompt: 'Создай 10 креативных постов для соцсетей на тему: [ТЕМА]. Для каждого поста: цепляющий заголовок, текст 100-150 слов, 3-5 хештегов, emoji.',
    color: 'from-pink-500 to-rose-500',
    category: 'text'
  },
  
  // Бизнес команды
  {
    id: 'business-plan',
    title: 'Бизнес-план',
    description: 'Полный бизнес-план проекта',
    icon: 'Briefcase',
    prompt: 'Составь подробный бизнес-план для: [ИДЕЯ]. Включи: описание, целевую аудиторию, конкурентов, маркетинг, финансовый план, риски, план развития.',
    color: 'from-gray-700 to-gray-900',
    category: 'business'
  },
  {
    id: 'swot',
    title: 'SWOT-анализ',
    description: 'Сильные и слабые стороны',
    icon: 'BarChart3',
    prompt: 'Проведи детальный SWOT-анализ для: [КОМПАНИЯ/ПРОЕКТ]. Опиши Strengths (сильные стороны), Weaknesses (слабости), Opportunities (возможности), Threats (угрозы). Для каждого раздела минимум 5 пунктов.',
    color: 'from-orange-500 to-red-500',
    category: 'business'
  },
  {
    id: 'presentation',
    title: 'Презентация',
    description: 'Структура для PowerPoint/Google Slides',
    icon: 'Presentation',
    prompt: 'Создай структуру презентации на тему: [ТЕМА]. Для каждого слайда: заголовок, ключевые пункты, тезисы для спикера. Минимум 10 слайдов.',
    color: 'from-indigo-500 to-purple-500',
    category: 'business'
  },
  
  // Код
  {
    id: 'python-script',
    title: 'Python скрипт',
    description: 'Готовый код с комментариями',
    icon: 'Code',
    prompt: 'Напиши Python скрипт для: [ЗАДАЧА]. Включи: импорты, функции с docstrings, обработку ошибок, примеры использования, комментарии.',
    color: 'from-blue-600 to-indigo-600',
    category: 'code'
  },
  {
    id: 'sql-query',
    title: 'SQL запросы',
    description: 'База данных и запросы',
    icon: 'Database',
    prompt: 'Создай SQL структуру базы данных для: [ПРОЕКТ]. Включи: CREATE TABLE со всеми полями, индексы, связи, 5 примеров SELECT запросов разной сложности.',
    color: 'from-teal-600 to-cyan-600',
    category: 'code'
  },
  {
    id: 'regex',
    title: 'RegEx генератор',
    description: 'Регулярные выражения',
    icon: 'Search',
    prompt: 'Создай регулярное выражение для: [ЗАДАЧА]. Приведи: паттерн, объяснение каждой части, примеры совпадений и несовпадений, код для Python/JavaScript.',
    color: 'from-green-600 to-emerald-600',
    category: 'code'
  },
  
  // Креатив
  {
    id: 'story',
    title: 'Написать историю',
    description: 'Рассказ или сценарий',
    icon: 'BookOpen',
    prompt: 'Напиши увлекательную историю на тему: [ТЕМА]. Включи: интересных персонажей, захватывающий сюжет, неожиданный поворот, яркие описания. Объем: 2000+ слов.',
    color: 'from-yellow-500 to-orange-500',
    category: 'creative'
  },
  {
    id: 'naming',
    title: 'Придумать название',
    description: '20+ вариантов названий',
    icon: 'Lightbulb',
    prompt: 'Придумай 20 креативных названий для: [ПРОЕКТ/КОМПАНИЯ]. Для каждого: название, краткое объяснение смысла, проверка на доступность домена .com/.ru.',
    color: 'from-pink-500 to-purple-500',
    category: 'creative'
  },
  {
    id: 'slogan',
    title: 'Слоган и УТП',
    description: 'Уникальное торговое предложение',
    icon: 'Sparkles',
    prompt: 'Создай 10 слоганов и УТП для: [ПРОДУКТ/УСЛУГА]. Каждый должен быть: запоминающимся, передавать ценность, отличаться от конкурентов.',
    color: 'from-cyan-500 to-blue-500',
    category: 'creative'
  },
  
  // Анализ
  {
    id: 'summary',
    title: 'Краткое резюме',
    description: 'Суть длинного текста',
    icon: 'FileSearch',
    prompt: 'Сделай краткое резюме текста: [ТЕКСТ]. Выдели: главную идею (1 предложение), ключевые пункты (5-7 пунктов), вывод.',
    color: 'from-violet-500 to-purple-500',
    category: 'analysis'
  },
  {
    id: 'pros-cons',
    title: 'Плюсы и минусы',
    description: 'Объективная оценка',
    icon: 'Scale',
    prompt: 'Проанализируй плюсы и минусы: [ТЕМА/РЕШЕНИЕ]. Для каждой стороны минимум 7 аргументов. В конце дай объективный вывод.',
    color: 'from-amber-500 to-orange-500',
    category: 'analysis'
  },
  {
    id: 'fact-check',
    title: 'Проверка фактов',
    description: 'Анализ достоверности информации',
    icon: 'Shield',
    prompt: 'Проверь достоверность информации: [УТВЕРЖДЕНИЕ]. Проанализируй: источники, логику, противоречия, альтернативные точки зрения.',
    color: 'from-red-500 to-pink-500',
    category: 'analysis'
  }
];

interface SpecialCommandsProps {
  onSelectCommand: (prompt: string) => void;
}

export default function SpecialCommands({ onSelectCommand }: SpecialCommandsProps) {
  const categories = [
    { id: 'text', name: 'Тексты', icon: 'FileText', color: 'text-blue-400' },
    { id: 'business', name: 'Бизнес', icon: 'Briefcase', color: 'text-purple-400' },
    { id: 'code', name: 'Код', icon: 'Code', color: 'text-green-400' },
    { id: 'creative', name: 'Креатив', icon: 'Sparkles', color: 'text-pink-400' },
    { id: 'analysis', name: 'Анализ', icon: 'Search', color: 'text-orange-400' }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Wand2" size={20} className="text-purple-400" />
        <h3 className="font-bold text-white">Специальные функции AI</h3>
      </div>
      
      {categories.map(category => {
        const commands = SPECIAL_COMMANDS.filter(cmd => cmd.category === category.id);
        
        return (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name={category.icon as any} size={16} className={category.color} />
              <h4 className="font-semibold text-white text-sm">{category.name}</h4>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {commands.map(cmd => (
                <button
                  key={cmd.id}
                  onClick={() => onSelectCommand(cmd.prompt)}
                  className={`group relative overflow-hidden rounded-lg p-3 text-left transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r ${cmd.color} hover:shadow-lg`}
                >
                  <div className="relative z-10 flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={cmd.icon as any} size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-white text-sm mb-1">{cmd.title}</h5>
                      <p className="text-xs text-white/80 leading-relaxed">{cmd.description}</p>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-white/60 group-hover:text-white transition-colors flex-shrink-0" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
