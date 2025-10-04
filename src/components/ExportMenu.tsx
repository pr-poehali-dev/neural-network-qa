import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { exportToText, exportToMarkdown, exportToHTML, exportToJSON, exportToWord } from '@/utils/exportChat';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface ExportMenuProps {
  messages: Message[];
  onClose: () => void;
}

const EXPORT_FORMATS = [
  {
    id: 'markdown',
    name: 'Markdown',
    description: 'Для GitHub, Notion',
    icon: 'FileCode',
    color: 'hover:bg-purple-50 border-purple-200',
    action: exportToMarkdown
  },
  {
    id: 'html',
    name: 'HTML',
    description: 'Красивая веб-страница',
    icon: 'Globe',
    color: 'hover:bg-blue-50 border-blue-200',
    action: exportToHTML
  },
  {
    id: 'word',
    name: 'Word',
    description: 'Документ .doc',
    icon: 'FileText',
    color: 'hover:bg-indigo-50 border-indigo-200',
    action: exportToWord
  },
  {
    id: 'text',
    name: 'Текст',
    description: 'Простой .txt файл',
    icon: 'File',
    color: 'hover:bg-gray-50 border-gray-200',
    action: exportToText
  },
  {
    id: 'json',
    name: 'JSON',
    description: 'Для разработчиков',
    icon: 'Braces',
    color: 'hover:bg-green-50 border-green-200',
    action: exportToJSON
  }
];

export default function ExportMenu({ messages, onClose }: ExportMenuProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (format: typeof EXPORT_FORMATS[0]) => {
    setExporting(format.id);
    
    setTimeout(() => {
      format.action(messages);
      setExporting(null);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 bg-white animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Icon name="Download" className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Экспорт чата</h3>
              <p className="text-sm text-gray-600">Выберите формат</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>

        <div className="space-y-2">
          {EXPORT_FORMATS.map(format => (
            <button
              key={format.id}
              onClick={() => handleExport(format)}
              disabled={exporting !== null}
              className={`w-full p-4 rounded-lg border-2 ${format.color} transition-all text-left disabled:opacity-50`}
            >
              <div className="flex items-center gap-3">
                {exporting === format.id ? (
                  <Icon name="Loader2" className="animate-spin text-indigo-600" size={24} />
                ) : (
                  <Icon name={format.icon as any} className="text-gray-700" size={24} />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{format.name}</p>
                  <p className="text-xs text-gray-600">{format.description}</p>
                </div>
                <Icon name="ChevronRight" className="text-gray-400" size={20} />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Icon name="Info" className="text-indigo-600 mt-0.5" size={16} />
            <p className="text-xs text-indigo-900">
              Файл будет сохранён в папку загрузок вашего браузера
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
