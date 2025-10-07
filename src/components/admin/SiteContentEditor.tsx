import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SiteContent, getDefaultContent } from './content-editor/types';
import HeroEditor from './content-editor/HeroEditor';
import FeaturesEditor from './content-editor/FeaturesEditor';
import AboutEditor from './content-editor/AboutEditor';
import FooterEditor from './content-editor/FooterEditor';

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
                <HeroEditor content={content} setContent={setContent} />
              )}

              {activeSection === 'features' && (
                <FeaturesEditor content={content} setContent={setContent} />
              )}

              {activeSection === 'about' && (
                <AboutEditor content={content} setContent={setContent} />
              )}

              {activeSection === 'footer' && (
                <FooterEditor content={content} setContent={setContent} />
              )}
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
