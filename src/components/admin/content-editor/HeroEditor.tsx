import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiteContent } from './types';

interface HeroEditorProps {
  content: SiteContent;
  setContent: (content: SiteContent) => void;
}

export default function HeroEditor({ content, setContent }: HeroEditorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Главный экран</h3>
      
      <div>
        <Label>Заголовок</Label>
        <Input
          value={content.hero.title}
          onChange={(e) => setContent({
            ...content,
            hero: { ...content.hero, title: e.target.value }
          })}
          placeholder="Богдан ИИ"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Подзаголовок</Label>
        <Input
          value={content.hero.subtitle}
          onChange={(e) => setContent({
            ...content,
            hero: { ...content.hero, subtitle: e.target.value }
          })}
          placeholder="Умный помощник"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Текст кнопки</Label>
        <Input
          value={content.hero.ctaButton}
          onChange={(e) => setContent({
            ...content,
            hero: { ...content.hero, ctaButton: e.target.value }
          })}
          placeholder="Начать общение"
          className="mt-1"
        />
      </div>
    </div>
  );
}
