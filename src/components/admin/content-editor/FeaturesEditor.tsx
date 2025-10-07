import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { SiteContent } from './types';

interface FeaturesEditorProps {
  content: SiteContent;
  setContent: (content: SiteContent) => void;
}

export default function FeaturesEditor({ content, setContent }: FeaturesEditorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Возможности</h3>
      
      <div>
        <Label>Заголовок секции</Label>
        <Input
          value={content.features.title}
          onChange={(e) => setContent({
            ...content,
            features: { ...content.features, title: e.target.value }
          })}
          className="mt-1"
        />
      </div>

      <div className="space-y-4 mt-6">
        {content.features.items.map((item, idx) => (
          <Card key={idx} className="p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Возможность {idx + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newItems = content.features.items.filter((_, i) => i !== idx);
                  setContent({
                    ...content,
                    features: { ...content.features, items: newItems }
                  });
                }}
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Иконка (название из lucide-react)</Label>
                <Input
                  value={item.icon}
                  onChange={(e) => {
                    const newItems = [...content.features.items];
                    newItems[idx] = { ...item, icon: e.target.value };
                    setContent({
                      ...content,
                      features: { ...content.features, items: newItems }
                    });
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Название</Label>
                <Input
                  value={item.title}
                  onChange={(e) => {
                    const newItems = [...content.features.items];
                    newItems[idx] = { ...item, title: e.target.value };
                    setContent({
                      ...content,
                      features: { ...content.features, items: newItems }
                    });
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Описание</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...content.features.items];
                    newItems[idx] = { ...item, description: e.target.value };
                    setContent({
                      ...content,
                      features: { ...content.features, items: newItems }
                    });
                  }}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          </Card>
        ))}
        
        <Button
          onClick={() => {
            setContent({
              ...content,
              features: {
                ...content.features,
                items: [
                  ...content.features.items,
                  { icon: 'Star', title: 'Новая возможность', description: 'Описание' }
                ]
              }
            });
          }}
          variant="outline"
          className="w-full"
        >
          <Icon name="Plus" className="mr-2" size={16} />
          Добавить возможность
        </Button>
      </div>
    </div>
  );
}
