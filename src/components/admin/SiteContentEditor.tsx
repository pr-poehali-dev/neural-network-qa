import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    ctaButton: string;
  };
  features: {
    title: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  about: {
    title: string;
    description: string;
    team: Array<{
      name: string;
      role: string;
      description: string;
      email: string;
      telegram: string;
      whatsapp: string;
    }>;
  };
  footer: {
    companyName: string;
    tagline: string;
    sections: Array<{
      title: string;
      links: Array<{
        label: string;
        href: string;
      }>;
    }>;
  };
}

export default function SiteContentEditor() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<'hero' | 'features' | 'about' | 'footer'>('hero');
  
  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('site_content_editor');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getDefaultContent();
      }
    }
    return getDefaultContent();
  });

  function getDefaultContent(): SiteContent {
    return {
      hero: {
        title: 'Богдан ИИ',
        subtitle: 'Умный помощник нового поколения',
        ctaButton: 'Начать общение'
      },
      features: {
        title: 'Наши возможности',
        items: [
          {
            icon: 'MessageSquare',
            title: 'Диалоги',
            description: 'Естественное общение на русском языке'
          },
          {
            icon: 'Image',
            title: 'Работа с изображениями',
            description: 'Анализ и обработка фото'
          },
          {
            icon: 'Code',
            title: 'Генерация кода',
            description: 'Помощь в программировании'
          },
          {
            icon: 'Globe',
            title: 'Переводы',
            description: '100+ языков мира'
          }
        ]
      },
      about: {
        title: 'О нас',
        description: 'Мы создаем будущее взаимодействия с искусственным интеллектом',
        team: [
          {
            name: 'Богдан Копаев',
            role: 'Создатель проекта',
            description: 'Основатель проекта Богдан ИИ',
            email: 'bogdan@bogdan-ai.com',
            telegram: 'https://t.me/bogdankop',
            whatsapp: 'https://wa.me/79111234567'
          }
        ]
      },
      footer: {
        companyName: 'Богдан ИИ',
        tagline: 'Умный помощник нового поколения',
        sections: [
          {
            title: 'Компания',
            links: [
              { label: 'О нас', href: '/about' },
              { label: 'Связаться', href: '/contact' }
            ]
          },
          {
            title: 'Документы',
            links: [
              { label: 'Политика конфиденциальности', href: '/privacy' },
              { label: 'Условия использования', href: '/terms' }
            ]
          }
        ]
      }
    };
  }

  useEffect(() => {
    localStorage.setItem('site_content_editor', JSON.stringify(content));
  }, [content]);

  const saveContent = () => {
    localStorage.setItem('site_content_data', JSON.stringify(content));
    toast({
      title: '✅ Контент сохранен',
      description: 'Изменения применены к сайту'
    });
  };

  const resetToDefaults = () => {
    if (confirm('Вы уверены? Все изменения будут сброшены.')) {
      setContent(getDefaultContent());
      toast({
        title: 'Сброшено к значениям по умолчанию'
      });
    }
  };

  const sections = [
    { id: 'hero' as const, name: 'Главный экран', icon: 'Home' },
    { id: 'features' as const, name: 'Возможности', icon: 'Sparkles' },
    { id: 'about' as const, name: 'О нас', icon: 'Users' },
    { id: 'footer' as const, name: 'Подвал сайта', icon: 'Layout' }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-8 border-2 border-purple-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Редактор контента сайта</h2>
            <p className="text-sm text-gray-600 mt-1">Измените любой текст на вашем сайте</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={resetToDefaults}
              variant="outline"
              className="border-gray-300"
            >
              <Icon name="RotateCcw" className="mr-2" size={18} />
              Сбросить
            </Button>
            <Button 
              onClick={saveContent}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              <Icon name="Save" className="mr-2" size={18} />
              Сохранить изменения
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Icon name={section.icon as any} size={20} />
                <span className="font-medium">{section.name}</span>
              </button>
            ))}
          </div>

          <div className="md:col-span-3">
            <Card className="p-6 bg-gray-50">
              {activeSection === 'hero' && (
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
              )}

              {activeSection === 'features' && (
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
              )}

              {activeSection === 'about' && (
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
              )}

              {activeSection === 'footer' && (
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
              )}
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
