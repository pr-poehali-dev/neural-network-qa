import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface SiteSettings {
  title: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  footerText: string;
  welcomeMessage: string;
  enableChat: boolean;
  enableVoice: boolean;
  maxFileSize: string;
  allowedTypes: string;
}

interface SiteSettingsTabProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

export default function SiteSettingsTab({ settings, onUpdateSettings }: SiteSettingsTabProps) {
  const { toast } = useToast();

  const saveSiteSettings = () => {
    localStorage.setItem('site_settings', JSON.stringify(settings));
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    toast({ title: 'Настройки сайта сохранены' });
  };

  return (
    <Card className="p-8 border-2 border-purple-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Настройки сайта</h2>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2">Название сайта</Label>
            <Input
              value={settings.title}
              onChange={(e) => onUpdateSettings({ ...settings, title: e.target.value })}
              className="border-purple-200"
            />
          </div>

          <div>
            <Label className="mb-2">Подзаголовок</Label>
            <Input
              value={settings.subtitle}
              onChange={(e) => onUpdateSettings({ ...settings, subtitle: e.target.value })}
              className="border-purple-200"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2">Основной цвет</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => onUpdateSettings({ ...settings, primaryColor: e.target.value })}
                className="w-20 h-10 border-purple-200"
              />
              <Input
                value={settings.primaryColor}
                onChange={(e) => onUpdateSettings({ ...settings, primaryColor: e.target.value })}
                className="flex-1 border-purple-200"
              />
            </div>
          </div>

          <div>
            <Label className="mb-2">Дополнительный цвет</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => onUpdateSettings({ ...settings, secondaryColor: e.target.value })}
                className="w-20 h-10 border-purple-200"
              />
              <Input
                value={settings.secondaryColor}
                onChange={(e) => onUpdateSettings({ ...settings, secondaryColor: e.target.value })}
                className="flex-1 border-purple-200"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-2">Текст в подвале</Label>
          <Input
            value={settings.footerText}
            onChange={(e) => onUpdateSettings({ ...settings, footerText: e.target.value })}
            className="border-purple-200"
          />
        </div>

        <div>
          <Label className="mb-2">Приветственное сообщение</Label>
          <Textarea
            value={settings.welcomeMessage}
            onChange={(e) => onUpdateSettings({ ...settings, welcomeMessage: e.target.value })}
            className="border-purple-200 min-h-[100px]"
            placeholder="Привет! 👋 Я помощник..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Это сообщение увидят пользователи при первом открытии чата
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 border border-purple-200 rounded-lg">
            <Label>Включить чат</Label>
            <Switch
              checked={settings.enableChat}
              onCheckedChange={(checked) => onUpdateSettings({ ...settings, enableChat: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-purple-200 rounded-lg">
            <Label>Включить голосового помощника</Label>
            <Switch
              checked={settings.enableVoice}
              onCheckedChange={(checked) => onUpdateSettings({ ...settings, enableVoice: checked })}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2">Макс. размер файла (MB)</Label>
            <Input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => onUpdateSettings({ ...settings, maxFileSize: e.target.value })}
              className="border-purple-200"
            />
          </div>

          <div>
            <Label className="mb-2">Разрешенные типы файлов</Label>
            <Input
              value={settings.allowedTypes}
              onChange={(e) => onUpdateSettings({ ...settings, allowedTypes: e.target.value })}
              className="border-purple-200"
              placeholder=".txt,.pdf,.doc"
            />
          </div>
        </div>

        <Button 
          onClick={saveSiteSettings}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Icon name="Save" className="mr-2" size={18} />
          Сохранить настройки
        </Button>
      </div>
    </Card>
  );
}