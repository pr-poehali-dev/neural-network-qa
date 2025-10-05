import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Block {
  id: string;
  type: 'header' | 'hero' | 'chat' | 'footer' | 'custom';
  title: string;
  visible: boolean;
  order: number;
}

export default function VisualEditorTab() {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'header', title: 'Header (Шапка сайта)', visible: true, order: 1 },
    { id: '2', type: 'hero', title: 'Hero (Приветствие)', visible: true, order: 2 },
    { id: '3', type: 'chat', title: 'Chat (Чат-бот)', visible: true, order: 3 },
    { id: '4', type: 'footer', title: 'Footer (Подвал)', visible: true, order: 4 },
  ]);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedBlock(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedBlock || draggedBlock === targetId) return;

    const draggedIndex = blocks.findIndex(b => b.id === draggedBlock);
    const targetIndex = blocks.findIndex(b => b.id === targetId);

    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, removed);

    // Reorder
    const reordered = newBlocks.map((block, index) => ({
      ...block,
      order: index + 1
    }));

    setBlocks(reordered);
    setDraggedBlock(null);
    toast({ title: 'Порядок блоков изменён' });
  };

  const toggleVisibility = (id: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, visible: !block.visible } : block
    ));
  };

  const addCustomBlock = () => {
    const title = prompt('Название блока:');
    if (title) {
      const newBlock: Block = {
        id: Date.now().toString(),
        type: 'custom',
        title,
        visible: true,
        order: blocks.length + 1
      };
      setBlocks(prev => [...prev, newBlock]);
      toast({ title: 'Блок добавлен!' });
    }
  };

  const deleteBlock = (id: string) => {
    if (confirm('Удалить блок?')) {
      setBlocks(prev => prev.filter(b => b.id !== id));
      toast({ title: 'Блок удалён' });
    }
  };

  const saveLayout = () => {
    localStorage.setItem('pageLayout', JSON.stringify(blocks));
    toast({ title: 'Макет сохранён!' });
  };

  const resetLayout = () => {
    if (confirm('Сбросить макет к дефолту?')) {
      setBlocks([
        { id: '1', type: 'header', title: 'Header (Шапка сайта)', visible: true, order: 1 },
        { id: '2', type: 'hero', title: 'Hero (Приветствие)', visible: true, order: 2 },
        { id: '3', type: 'chat', title: 'Chat (Чат-бот)', visible: true, order: 3 },
        { id: '4', type: 'footer', title: 'Footer (Подвал)', visible: true, order: 4 },
      ]);
      localStorage.removeItem('pageLayout');
      toast({ title: 'Макет сброшен' });
    }
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'header': return 'LayoutDashboard';
      case 'hero': return 'Sparkles';
      case 'chat': return 'MessageSquare';
      case 'footer': return 'Layout';
      case 'custom': return 'Box';
      default: return 'Box';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">📐 Визуальный редактор макета</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Перетаскивайте блоки для изменения порядка. Включайте/выключайте блоки по необходимости.
        </p>

        <div className="space-y-3">
          {blocks.map((block) => (
            <div
              key={block.id}
              draggable
              onDragStart={() => handleDragStart(block.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(block.id)}
              className={`
                flex items-center justify-between p-4 rounded-lg border-2 
                transition-all cursor-move
                ${block.visible 
                  ? 'bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800' 
                  : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 opacity-50'
                }
                ${draggedBlock === block.id ? 'opacity-50 scale-95' : ''}
                hover:shadow-lg
              `}
            >
              <div className="flex items-center gap-4">
                <Icon name="GripVertical" size={20} className="text-gray-400" />
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Icon name={getBlockIcon(block.type) as any} className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{block.title}</h4>
                  <p className="text-sm text-gray-500">Порядок: {block.order}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleVisibility(block.id)}
                  className={block.visible ? '' : 'opacity-50'}
                >
                  <Icon name={block.visible ? 'Eye' : 'EyeOff'} size={16} />
                </Button>
                {block.type === 'custom' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteBlock(block.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={addCustomBlock} variant="outline">
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить блок
          </Button>
          <Button onClick={saveLayout} className="bg-gradient-to-r from-indigo-600 to-purple-600">
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить макет
          </Button>
          <Button onClick={resetLayout} variant="destructive">
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Сбросить
          </Button>
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <h3 className="text-lg font-semibold mb-4">👁️ Превью макета</h3>
        <div className="space-y-2 bg-white dark:bg-gray-900 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          {blocks
            .filter(b => b.visible)
            .sort((a, b) => a.order - b.order)
            .map((block) => (
              <div
                key={block.id}
                className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg text-sm"
              >
                {block.order}. {block.title}
              </div>
            ))}
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-green-600 dark:text-green-400 mt-1" />
          <div>
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">💡 Как использовать</h4>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
              <li>• <strong>Перетащите</strong> блоки вверх/вниз для изменения порядка</li>
              <li>• Нажмите <Icon name="Eye" size={14} className="inline" /> чтобы скрыть блок</li>
              <li>• Добавляйте свои блоки кнопкой "Добавить блок"</li>
              <li>• Нажмите "Сохранить" чтобы применить изменения</li>
              <li>• Блоки Header и Footer рекомендуется оставить на своих местах</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
