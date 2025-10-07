import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiteContent } from './types';

interface FooterEditorProps {
  content: SiteContent;
  setContent: (content: SiteContent) => void;
}

export default function FooterEditor({ content, setContent }: FooterEditorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Подвал сайта</h3>
      
      <div>
        <Label>Название компании</Label>
        <Input
          value={content.footer.companyName}
          onChange={(e) => setContent({
            ...content,
            footer: { ...content.footer, companyName: e.target.value }
          })}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Слоган</Label>
        <Input
          value={content.footer.tagline}
          onChange={(e) => setContent({
            ...content,
            footer: { ...content.footer, tagline: e.target.value }
          })}
          className="mt-1"
        />
      </div>

      <div className="space-y-4 mt-6">
        <h4 className="font-semibold">Секции ссылок</h4>
        <p className="text-xs text-gray-600">Редактирование секций футера временно недоступно. Используйте визуальный редактор для изменения ссылок.</p>
      </div>
    </div>
  );
}
