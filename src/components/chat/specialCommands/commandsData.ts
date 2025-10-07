import { SpecialCommand } from './types';

export const SPECIAL_COMMANDS: SpecialCommand[] = [
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
  {
    id: 'cold-email',
    title: 'Холодное письмо',
    description: 'Первое касание с клиентом',
    icon: 'MailOpen',
    prompt: 'Напиши холодное email-письмо для: [ЦЕЛЬ]. Включи: персонализированное приветствие, краткую ценность, конкретный призыв к действию. Максимум 150 слов.',
    color: 'from-blue-600 to-indigo-600',
    category: 'text'
  },
  {
    id: 'job-description',
    title: 'Вакансия',
    description: 'Описание вакансии для найма',
    icon: 'Users',
    prompt: 'Создай описание вакансии для: [ДОЛЖНОСТЬ]. Включи: обязанности, требования, условия, компанию, как откликнуться. Сделай привлекательно для кандидатов.',
    color: 'from-emerald-600 to-teal-600',
    category: 'text'
  },
  {
    id: 'case-study',
    title: 'Кейс-стади',
    description: 'История успеха клиента',
    icon: 'Award',
    prompt: 'Напиши кейс-стади о: [ПРОЕКТ/КЛИЕНТ]. Структура: проблема, решение, результаты (с цифрами), отзыв клиента, выводы.',
    color: 'from-amber-600 to-orange-600',
    category: 'text'
  },
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
  {
    id: 'elevator-pitch',
    title: 'Elevator Pitch',
    description: 'Презентация за 30 секунд',
    icon: 'Presentation',
    prompt: 'Создай elevator pitch (30-секундная презентация) для: [ПРОДУКТ/ИДЕЯ]. Расскажи: что, для кого, какая проблема решается, почему уникально.',
    color: 'from-purple-600 to-fuchsia-600',
    category: 'business'
  },
  {
    id: 'value-proposition',
    title: 'Ценностное предложение',
    description: 'Value Proposition Canvas',
    icon: 'Target',
    prompt: 'Создай ценностное предложение для: [ПРОДУКТ]. Опиши: сегмент клиентов, их задачи, боли, выгоды; твои продукты, решения болей, создатели выгод.',
    color: 'from-rose-600 to-pink-600',
    category: 'business'
  },
  {
    id: 'investor-pitch',
    title: 'Питч для инвесторов',
    description: 'Презентация проекта инвесторам',
    icon: 'TrendingUp',
    prompt: 'Создай питч для инвесторов для: [ПРОЕКТ]. Включи: проблему, решение, рынок, модель монетизации, команду, тракшн, запрос инвестиций, использование средств.',
    color: 'from-green-700 to-emerald-700',
    category: 'business'
  },
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
  {
    id: 'brand-story',
    title: 'История бренда',
    description: 'Легенда компании',
    icon: 'BookOpen',
    prompt: 'Напиши историю бренда для: [КОМПАНИЯ]. Расскажи: как всё начиналось, какие сложности преодолели, миссия, ценности, куда движетесь.',
    color: 'from-indigo-600 to-purple-600',
    category: 'creative'
  },
  {
    id: 'character',
    title: 'Создать персонажа',
    description: 'Детальный образ героя',
    icon: 'User',
    prompt: 'Создай персонажа для: [ТИП_ИСТОРИИ]. Опиши: имя, возраст, внешность, характер, предыстория, мотивация, конфликты, развитие.',
    color: 'from-pink-600 to-rose-600',
    category: 'creative'
  },
  {
    id: 'podcast-script',
    title: 'Сценарий подкаста',
    description: 'Выпуск подкаста на тему',
    icon: 'Radio',
    prompt: 'Напиши сценарий подкаста на тему: [ТЕМА]. Длительность: [МИНУТЫ]. Включи: интро, основные блоки, вопросы гостю (если есть), аутро, призыв к действию.',
    color: 'from-cyan-600 to-blue-600',
    category: 'creative'
  },
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
  {
    id: 'user-persona',
    title: 'Портрет клиента',
    description: 'Детальная персона',
    icon: 'UserCircle',
    prompt: 'Создай портрет целевого клиента (user persona) для: [ПРОДУКТ]. Включи: демографию, цели, боли, поведение, источники информации, возражения.',
    color: 'from-blue-700 to-indigo-700',
    category: 'analysis'
  },
  {
    id: 'gap-analysis',
    title: 'Анализ разрывов',
    description: 'Текущее vs Желаемое состояние',
    icon: 'GitBranch',
    prompt: 'Проведи gap-анализ для: [КОМПАНИЯ/ПРОЕКТ]. Опиши: текущее состояние, желаемое состояние, разрывы, причины разрывов, план устранения.',
    color: 'from-orange-700 to-red-700',
    category: 'analysis'
  },
  {
    id: 'risk-analysis',
    title: 'Анализ рисков',
    description: 'Выявление и оценка рисков',
    icon: 'AlertTriangle',
    prompt: 'Проведи анализ рисков для: [ПРОЕКТ]. Для каждого риска: описание, вероятность, влияние, меры предотвращения, план реагирования.',
    color: 'from-red-600 to-rose-600',
    category: 'analysis'
  },
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
  },
  {
    id: 'mind-map',
    title: 'Интеллект-карта',
    description: 'Структурированная схема темы',
    icon: 'Network',
    prompt: 'Создай интеллект-карту (mind map) для темы: [ТЕМА]. Центральная идея → основные ветви → подтемы → детали. Используй иерархию и связи.',
    color: 'from-teal-500 to-cyan-500',
    category: 'education'
  },
  {
    id: 'flashcards',
    title: 'Карточки для запоминания',
    description: '20 карточек вопрос-ответ',
    icon: 'Layers',
    prompt: 'Создай 20 карточек для запоминания по теме: [ТЕМА]. Формат: вопрос на одной стороне, ответ на другой. От простых к сложным.',
    color: 'from-violet-500 to-purple-500',
    category: 'education'
  }
];
