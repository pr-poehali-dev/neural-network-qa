import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface QuickButton {
  id: string;
  text: string;
  emoji: string;
  enabled: boolean;
}

const defaultButtons: QuickButton[] = [
  { id: '1', text: 'Сколько стоит?', emoji: '💰', enabled: true },
  { id: '2', text: 'Как заказать?', emoji: '🛒', enabled: true },
  { id: '3', text: 'Контакты', emoji: '📞', enabled: true },
  { id: '4', text: 'Режим работы', emoji: '⏰', enabled: true },
  { id: '5', text: 'Условия доставки', emoji: '🚚', enabled: false },
  { id: '6', text: 'Гарантия', emoji: '✅', enabled: false },
];

export default function QuickButtonsTab() {
  const [buttons, setButtons] = useState<QuickButton[]>(() => {
    const saved = localStorage.getItem('quick_buttons');
    return saved ? JSON.parse(saved) : defaultButtons;
  });
  const [newButton, setNewButton] = useState({ text: '', emoji: '💡' });
  const { toast } = useToast();

  const saveButtons = (updatedButtons: QuickButton[]) => {
    setButtons(updatedButtons);
    localStorage.setItem('quick_buttons', JSON.stringify(updatedButtons));
    toast({ title: 'Кнопки сохранены' });
  };

  const addButton = () => {
    if (!newButton.text.trim()) {
      toast({ title: 'Введите текст кнопки', variant: 'destructive' });
      return;
    }
    const newBtn: QuickButton = {
      id: Date.now().toString(),
      text: newButton.text,
      emoji: newButton.emoji,
      enabled: true
    };
    saveButtons([...buttons, newBtn]);
    setNewButton({ text: '', emoji: '💡' });
  };

  const toggleButton = (id: string) => {
    saveButtons(buttons.map(btn => 
      btn.id === id ? { ...btn, enabled: !btn.enabled } : btn
    ));
  };

  const deleteButton = (id: string) => {
    saveButtons(buttons.filter(btn => btn.id !== id));
  };

  const emojiList = ['💰', '🛒', '📞', '⏰', '🚚', '✅', '❓', '📧', '🏠', '⭐', '🎯', '📝', '🔥', '💡', '🎉', '👍'];

  return (
    <div className="space-y-6">
      <Card className="p-6 dark:bg-gray-800 border-purple-200 dark:border-purple-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <Icon name="Zap" size={20} className="text-purple-600" />
          Быстрые кнопки
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Настройте кнопки с частыми вопросами, которые пользователи смогут нажимать для быстрого ответа
        </p>

        <div className="space-y-3 mb-6">
          {buttons.map((btn) => (
            <div key={btn.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-2xl">{btn.emoji}</span>
              <span className="flex-1 text-gray-900 dark:text-white">{btn.text}</span>
              <Button
                variant={btn.enabled ? "default" : "outline"}
                size="sm"
                onClick={() => toggleButton(btn.id)}
                className={btn.enabled ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {btn.enabled ? <Icon name="Eye" size={16} /> : <Icon name="EyeOff" size={16} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteButton(btn.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Добавить новую кнопку</h4>
          <div className="flex gap-2 mb-3">
            <div className="flex gap-2 flex-wrap">
              {emojiList.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setNewButton({ ...newButton, emoji })}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    newButton.emoji === emoji 
                      ? 'bg-purple-100 dark:bg-purple-900 ring-2 ring-purple-500' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Текст кнопки (например: Сколько стоит?)"
              value={newButton.text}
              onChange={(e) => setNewButton({ ...newButton, text: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && addButton()}
              className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
            <Button onClick={addButton} className="bg-purple-600 hover:bg-purple-700">
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 dark:bg-gray-800 border-blue-200 dark:border-blue-700">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
          <Icon name="Info" size={20} className="text-blue-600" />
          Как это работает
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Кнопки появляются под полем ввода в чате</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Пользователь кликает → вопрос отправляется автоматически</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Можно включать/выключать кнопки без удаления</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Выбирайте эмодзи для визуальной привлекательности</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
