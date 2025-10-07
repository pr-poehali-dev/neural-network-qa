import { CommandCategory } from './types';

export const COMMAND_CATEGORIES: CommandCategory[] = [
  { id: 'text', name: 'Тексты', icon: 'FileText', color: 'text-blue-400' },
  { id: 'business', name: 'Бизнес', icon: 'Briefcase', color: 'text-purple-400' },
  { id: 'code', name: 'Код', icon: 'Code', color: 'text-green-400' },
  { id: 'creative', name: 'Креатив', icon: 'Sparkles', color: 'text-pink-400' },
  { id: 'analysis', name: 'Анализ', icon: 'Search', color: 'text-orange-400' },
  { id: 'education', name: 'Обучение', icon: 'GraduationCap', color: 'text-cyan-400' }
];
