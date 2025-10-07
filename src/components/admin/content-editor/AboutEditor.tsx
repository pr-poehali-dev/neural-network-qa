import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { SiteContent } from './types';

interface AboutEditorProps {
  content: SiteContent;
  setContent: (content: SiteContent) => void;
}

export default function AboutEditor({ content, setContent }: AboutEditorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">О нас</h3>
      
      <div>
        <Label>Заголовок</Label>
        <Input
          value={content.about.title}
          onChange={(e) => setContent({
            ...content,
            about: { ...content.about, title: e.target.value }
          })}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Описание</Label>
        <Textarea
          value={content.about.description}
          onChange={(e) => setContent({
            ...content,
            about: { ...content.about, description: e.target.value }
          })}
          className="mt-1"
          rows={3}
        />
      </div>

      <div className="space-y-4 mt-6">
        <h4 className="font-semibold">Члены команды</h4>
        {content.about.team.map((member, idx) => (
          <Card key={idx} className="p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold">Участник {idx + 1}</h5>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newTeam = content.about.team.filter((_, i) => i !== idx);
                  setContent({
                    ...content,
                    about: { ...content.about, team: newTeam }
                  });
                }}
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Имя</Label>
                  <Input
                    value={member.name}
                    onChange={(e) => {
                      const newTeam = [...content.about.team];
                      newTeam[idx] = { ...member, name: e.target.value };
                      setContent({
                        ...content,
                        about: { ...content.about, team: newTeam }
                      });
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Должность</Label>
                  <Input
                    value={member.role}
                    onChange={(e) => {
                      const newTeam = [...content.about.team];
                      newTeam[idx] = { ...member, role: e.target.value };
                      setContent({
                        ...content,
                        about: { ...content.about, team: newTeam }
                      });
                    }}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Описание</Label>
                <Textarea
                  value={member.description}
                  onChange={(e) => {
                    const newTeam = [...content.about.team];
                    newTeam[idx] = { ...member, description: e.target.value };
                    setContent({
                      ...content,
                      about: { ...content.about, team: newTeam }
                    });
                  }}
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input
                    value={member.email}
                    onChange={(e) => {
                      const newTeam = [...content.about.team];
                      newTeam[idx] = { ...member, email: e.target.value };
                      setContent({
                        ...content,
                        about: { ...content.about, team: newTeam }
                      });
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Telegram</Label>
                  <Input
                    value={member.telegram}
                    onChange={(e) => {
                      const newTeam = [...content.about.team];
                      newTeam[idx] = { ...member, telegram: e.target.value };
                      setContent({
                        ...content,
                        about: { ...content.about, team: newTeam }
                      });
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">WhatsApp</Label>
                  <Input
                    value={member.whatsapp}
                    onChange={(e) => {
                      const newTeam = [...content.about.team];
                      newTeam[idx] = { ...member, whatsapp: e.target.value };
                      setContent({
                        ...content,
                        about: { ...content.about, team: newTeam }
                      });
                    }}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        <Button
          onClick={() => {
            setContent({
              ...content,
              about: {
                ...content.about,
                team: [
                  ...content.about.team,
                  {
                    name: 'Новый участник',
                    role: 'Должность',
                    description: 'Описание',
                    email: 'email@example.com',
                    telegram: 'https://t.me/username',
                    whatsapp: 'https://wa.me/79123456789'
                  }
                ]
              }
            });
          }}
          variant="outline"
          className="w-full"
        >
          <Icon name="Plus" className="mr-2" size={16} />
          Добавить участника
        </Button>
      </div>
    </div>
  );
}
