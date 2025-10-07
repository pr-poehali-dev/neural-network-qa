import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SpecialCommand {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
  color: string;
  category: 'text' | 'business' | 'code' | 'creative' | 'analysis' | 'education';
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
  {
    id: 'press-release',
    title: 'Пресс-релиз',
    description: 'Официальное объявление для СМИ',
    icon: 'Newspaper',
    prompt: 'Напиши профессиональный пресс-релиз на тему: [СОБЫТИЕ]. Включи: заголовок, лид-абзац, основную часть, цитаты, контактную информацию, бойлерплейт компании.',
    color: 'from-slate-600 to-slate-800',
    category: 'text'
  },
  {
    id: 'product-description',
    title: 'Описание товара',
    description: 'Продающее описание для магазина',
    icon: 'ShoppingBag',
    prompt: 'Создай продающее описание товара: [ТОВАР]. Включи: цепляющий заголовок, характеристики, преимущества, применение, призыв к покупке. Оптимизируй под SEO.',
    color: 'from-emerald-500 to-teal-500',
    category: 'text'
  },
  {
    id: 'faq',
    title: 'FAQ (вопросы-ответы)',
    description: '15 популярных вопросов',
    icon: 'HelpCircle',
    prompt: 'Создай раздел FAQ (часто задаваемые вопросы) для: [ТЕМА/ПРОДУКТ]. Напиши 15 важных вопросов с подробными ответами.',
    color: 'from-blue-400 to-cyan-400',
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
  {
    id: 'marketing-plan',
    title: 'Маркетинг-план',
    description: 'Стратегия продвижения',
    icon: 'TrendingUp',
    prompt: 'Составь маркетинговый план для: [ПРОДУКТ/УСЛУГА]. Включи: целевую аудиторию, каналы продвижения, контент-план, бюджет, KPI, timeline на 6 месяцев.',
    color: 'from-green-600 to-emerald-600',
    category: 'business'
  },
  {
    id: 'competitor-analysis',
    title: 'Анализ конкурентов',
    description: 'Кто главные конкуренты',
    icon: 'Users',
    prompt: 'Проведи анализ конкурентов в нише: [НИША]. Для каждого конкурента: сильные стороны, слабости, стратегия, цены, уникальность. Дай рекомендации.',
    color: 'from-red-600 to-orange-600',
    category: 'business'
  },
  {
    id: 'sales-script',
    title: 'Скрипт продаж',
    description: 'Диалог с клиентом',
    icon: 'Phone',
    prompt: 'Создай скрипт продаж для: [ПРОДУКТ/УСЛУГА]. Включи: приветствие, выявление потребностей, презентацию, работу с возражениями, закрытие сделки.',
    color: 'from-purple-600 to-pink-600',
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
  {
    id: 'html-css',
    title: 'HTML + CSS страница',
    description: 'Готовая веб-страница',
    icon: 'Layout',
    prompt: 'Создай HTML страницу с CSS для: [ОПИСАНИЕ]. Включи: семантическую разметку, адаптивный дизайн, современные CSS-фичи, комментарии.',
    color: 'from-orange-600 to-red-600',
    category: 'code'
  },
  {
    id: 'api-integration',
    title: 'API интеграция',
    description: 'Код для работы с API',
    icon: 'Plug',
    prompt: 'Напиши код для интеграции с API: [API_NAME]. Включи: аутентификацию, основные endpoints, обработку ошибок, примеры запросов на Python/JavaScript.',
    color: 'from-cyan-600 to-blue-600',
    category: 'code'
  },
  {
    id: 'unit-tests',
    title: 'Unit-тесты',
    description: 'Тестирование кода',
    icon: 'CheckCircle',
    prompt: 'Создай unit-тесты для функции: [КОД_ФУНКЦИИ]. Покрой разные сценарии: нормальные случаи, граничные значения, ошибки. Используй pytest/Jest.',
    color: 'from-lime-600 to-green-600',
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
  {
    id: 'video-script',
    title: 'Сценарий видео',
    description: 'Для YouTube, TikTok, Reels',
    icon: 'Video',
    prompt: 'Напиши сценарий видео на тему: [ТЕМА]. Длительность: [МИНУТЫ]. Включи: хук, основную часть, призыв к действию, таймкоды, идеи для визуала.',
    color: 'from-red-500 to-rose-500',
    category: 'creative'
  },
  {
    id: 'quiz',
    title: 'Создать квиз',
    description: '10 вопросов с вариантами',
    icon: 'ListChecks',
    prompt: 'Создай интересный квиз на тему: [ТЕМА]. 10 вопросов с 4 вариантами ответов каждый. Укажи правильные ответы и объяснения.',
    color: 'from-violet-500 to-fuchsia-500',
    category: 'creative'
  },
  {
    id: 'poem',
    title: 'Написать стихотворение',
    description: 'Стихи на любую тему',
    icon: 'Feather',
    prompt: 'Напиши красивое стихотворение на тему: [ТЕМА]. Используй рифму, метафоры, яркие образы. Длина: 16-24 строки.',
    color: 'from-sky-500 to-blue-500',
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
  },
  {
    id: 'text-improvement',
    title: 'Улучшить текст',
    description: 'Исправить и улучшить',
    icon: 'Wand2',
    prompt: 'Улучши этот текст: [ТЕКСТ]. Исправь: грамматику, стиль, структуру, читабельность. Сделай текст более убедительным и профессиональным.',
    color: 'from-indigo-500 to-blue-500',
    category: 'analysis'
  },
  {
    id: 'compare',
    title: 'Сравнить варианты',
    description: 'Что выбрать и почему',
    icon: 'GitCompare',
    prompt: 'Сравни варианты: [ВАРИАНТ_1] vs [ВАРИАНТ_2]. Проанализируй: плюсы, минусы, стоимость, удобство, перспективы. Дай рекомендацию.',
    color: 'from-fuchsia-500 to-pink-500',
    category: 'analysis'
  },
  {
    id: 'roadmap',
    title: 'Дорожная карта',
    description: 'План развития проекта',
    icon: 'Map',
    prompt: 'Создай дорожную карту (roadmap) для: [ПРОЕКТ]. На 12 месяцев с разбивкой по кварталам. Для каждого периода: цели, задачи, метрики, ресурсы.',
    color: 'from-amber-500 to-orange-500',
    category: 'analysis'
  },
  
  // Обучение
  {
    id: 'explain-simple',
    title: 'Объясни просто',
    description: 'Как для 5-летнего ребёнка',
    icon: 'Baby',
    prompt: 'Объясни простыми словами (как для 5-летнего ребёнка) концепцию: [КОНЦЕПЦИЯ]. Используй простые примеры, аналогии, без сложных терминов.',
    color: 'from-green-400 to-emerald-400',
    category: 'education'
  },
  {
    id: 'study-plan',
    title: 'План обучения',
    description: 'Как изучить с нуля',
    icon: 'GraduationCap',
    prompt: 'Составь подробный план обучения для изучения: [ТЕМА/НАВЫК]. Разбей на этапы, укажи ресурсы, сроки, практические задания. Расчёт на 3 месяца.',
    color: 'from-blue-500 to-indigo-500',
    category: 'education'
  },
  {
    id: 'cheat-sheet',
    title: 'Шпаргалка',
    description: 'Краткая справка по теме',
    icon: 'FileCode',
    prompt: 'Создай шпаргалку (cheat sheet) по теме: [ТЕМА]. Включи: основные понятия, формулы, команды, примеры, полезные ссылки. Всё кратко и по делу.',
    color: 'from-purple-500 to-pink-500',
    category: 'education'
  },
  {
    id: 'practice-tasks',
    title: 'Практические задания',
    description: '10 заданий для практики',
    icon: 'ClipboardCheck',
    prompt: 'Создай 10 практических заданий для изучения: [ТЕМА]. От простого к сложному. Для каждого: задание, подсказка, решение.',
    color: 'from-orange-500 to-red-500',
    category: 'education'
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
    { id: 'analysis', name: 'Анализ', icon: 'Search', color: 'text-orange-400' },
    { id: 'education', name: 'Обучение', icon: 'GraduationCap', color: 'text-cyan-400' }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Wand2" size={20} className="text-purple-400" />
        <h3 className="font-bold text-white">Специальные функции AI</h3>
        <span className="ml-auto bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
          {SPECIAL_COMMANDS.length} функций
        </span>
      </div>
      
      {categories.map(category => {
        const commands = SPECIAL_COMMANDS.filter(cmd => cmd.category === category.id);
        
        return (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name={category.icon as any} size={16} className={category.color} />
              <h4 className="font-semibold text-white text-sm">{category.name}</h4>
              <span className="text-xs text-gray-400">({commands.length})</span>
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
