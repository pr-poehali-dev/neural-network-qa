import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Template {
  id: string;
  title: string;
  prompt: string;
  category: string;
  icon: string;
}

interface PromptTemplatesProps {
  onSelectTemplate: (prompt: string) => void;
  onClose: () => void;
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: '1',
    title: 'Email на английском',
    prompt: 'Напиши деловое письмо на английском языке на тему: ',
    category: 'Работа',
    icon: 'Mail'
  },
  {
    id: '2',
    title: 'План на день',
    prompt: 'Составь оптимальный план на день с учётом следующих задач: ',
    category: 'Планирование',
    icon: 'Calendar'
  },
  {
    id: '3',
    title: 'Объяснение кода',
    prompt: 'Объясни подробно, что делает следующий код: ',
    category: 'Код',
    icon: 'Code'
  },
  {
    id: '4',
    title: 'Проверка грамматики',
    prompt: 'Исправь все ошибки и улучши стиль: ',
    category: 'Текст',
    icon: 'CheckCircle'
  },
  {
    id: '5',
    title: 'Резюме текста',
    prompt: 'Сделай краткое резюме (5-7 ключевых пунктов) следующего текста: ',
    category: 'Текст',
    icon: 'FileDown'
  },
  {
    id: '6',
    title: 'Идеи для проекта',
    prompt: 'Предложи 10 креативных идей для проекта на тему: ',
    category: 'Творчество',
    icon: 'Lightbulb'
  }
];

export default function PromptTemplates({ onSelectTemplate, onClose }: PromptTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>(() => {
    const saved = localStorage.getItem('prompt_templates');
    return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [newTemplate, setNewTemplate] = useState({ title: '', prompt: '', category: 'Личное' });
  const [isAdding, setIsAdding] = useState(false);

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const handleSaveTemplate = () => {
    if (!newTemplate.title || !newTemplate.prompt) return;

    const template: Template = {
      id: Date.now().toString(),
      title: newTemplate.title,
      prompt: newTemplate.prompt,
      category: newTemplate.category,
      icon: 'Star'
    };

    const updated = [...templates, template];
    setTemplates(updated);
    localStorage.setItem('prompt_templates', JSON.stringify(updated));
    
    setNewTemplate({ title: '', prompt: '', category: 'Личное' });
    setIsAdding(false);
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem('prompt_templates', JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 bg-white animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
              <Icon name="BookmarkPlus" className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Шаблоны промптов</h3>
              <p className="text-sm text-gray-600">Сохраняй часто используемые запросы</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Поиск шаблонов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="mb-4">
          <Button 
            onClick={() => setIsAdding(!isAdding)} 
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Создать новый шаблон
          </Button>
        </div>

        {isAdding && (
          <Card className="p-4 mb-4 border-2 border-pink-200 bg-pink-50">
            <div className="space-y-3">
              <Input
                placeholder="Название шаблона"
                value={newTemplate.title}
                onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
              />
              <Input
                placeholder="Текст промпта"
                value={newTemplate.prompt}
                onChange={(e) => setNewTemplate({ ...newTemplate, prompt: e.target.value })}
              />
              <div className="flex gap-2">
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-md"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Личное">+ Новая категория</option>
                </select>
                <Button onClick={handleSaveTemplate} variant="default">
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-2">
          {filteredTemplates.map(template => (
            <Card 
              key={template.id}
              className="p-4 border-2 hover:border-pink-300 transition-all group cursor-pointer"
              onClick={() => {
                onSelectTemplate(template.prompt);
                onClose();
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={template.icon as any} className="text-pink-600" size={18} />
                    <h4 className="font-semibold text-gray-900">{template.title}</h4>
                    <span className="text-xs px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{template.prompt}</p>
                </div>
                {!DEFAULT_TEMPLATES.find(t => t.id === template.id) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTemplate(template.id);
                    }}
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <p className="text-center text-gray-500 py-8">Шаблоны не найдены</p>
        )}
      </Card>
    </div>
  );
}
