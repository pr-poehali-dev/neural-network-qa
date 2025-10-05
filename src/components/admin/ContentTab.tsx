import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface CustomPage {
  id: string;
  title: string;
  content: string;
}

interface ContentTabProps {
  pages: CustomPage[];
  onAddPage: () => void;
  onUpdatePage: (id: string, field: 'title' | 'content', value: string) => void;
  onDeletePage: (id: string) => void;
  onSavePages: () => void;
}

export default function ContentTab({ 
  pages, 
  onAddPage, 
  onUpdatePage, 
  onDeletePage, 
  onSavePages 
}: ContentTabProps) {
  return (
    <div className="space-y-6">
      <Card className="p-8 border-2 border-purple-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Управление страницами</h2>
          <Button 
            onClick={onAddPage}
            className="bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            <Icon name="Plus" className="mr-2" size={18} />
            Добавить страницу
          </Button>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Icon name="FileText" className="mx-auto mb-4 text-gray-400" size={48} />
            <p>Нет созданных страниц. Нажмите "Добавить страницу"</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pages.map(page => (
              <Card key={page.id} className="p-6 border border-purple-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Input
                      value={page.title}
                      onChange={(e) => onUpdatePage(page.id, 'title', e.target.value)}
                      className="text-lg font-semibold border-purple-200 flex-1 mr-4"
                      placeholder="Название страницы"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDeletePage(page.id)}
                    >
                      <Icon name="Trash2" className="text-red-500" size={18} />
                    </Button>
                  </div>
                  <Textarea
                    value={page.content}
                    onChange={(e) => onUpdatePage(page.id, 'content', e.target.value)}
                    className="min-h-[200px] border-purple-200 font-mono text-sm"
                    placeholder="HTML контент страницы..."
                  />
                </div>
              </Card>
            ))}
            <Button 
              onClick={onSavePages}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              <Icon name="Save" className="mr-2" size={18} />
              Сохранить все страницы
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
