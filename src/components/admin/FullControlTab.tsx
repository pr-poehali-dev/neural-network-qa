import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function FullControlTab() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<'colors' | 'layout' | 'components' | 'advanced'>('colors');

  // Цвета
  const [colors, setColors] = useState({
    primary: '#6366f1',
    secondary: '#a855f7',
    accent: '#ec4899',
    background: '#ffffff',
    text: '#000000',
  });

  // Компоненты
  const [components, setComponents] = useState({
    showHeader: true,
    showFooter: true,
    showGamification: true,
    showProfile: true,
    showTools: true,
    showQuickButtons: true,
    showContactButtons: true,
  });

  // Layout
  const [layout, setLayout] = useState({
    headerHeight: '80',
    maxWidth: '1280',
    borderRadius: '12',
    spacing: '24',
    fontSize: '16',
  });

  // Advanced
  const [advanced, setAdvanced] = useState({
    customCSS: '',
    customJS: '',
    headTags: '',
  });

  const handleColorChange = (key: string, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
    document.documentElement.style.setProperty(`--${key}`, value);
  };

  const handleLayoutChange = (key: string, value: string) => {
    setLayout(prev => ({ ...prev, [key]: value }));
    document.documentElement.style.setProperty(`--layout-${key}`, value);
  };

  const handleComponentToggle = (key: string) => {
    setComponents(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const applyCustomCSS = () => {
    const styleEl = document.getElementById('admin-custom-css');
    if (styleEl) {
      styleEl.innerHTML = advanced.customCSS;
    } else {
      const style = document.createElement('style');
      style.id = 'admin-custom-css';
      style.innerHTML = advanced.customCSS;
      document.head.appendChild(style);
    }
    toast({ title: 'CSS применён!' });
  };

  const applyCustomJS = () => {
    try {
      eval(advanced.customJS);
      toast({ title: 'JavaScript выполнен!' });
    } catch (e) {
      toast({ title: 'Ошибка в JS', description: String(e), variant: 'destructive' });
    }
  };

  const exportConfig = () => {
    const config = { colors, components, layout, advanced };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-config.json';
    a.click();
    toast({ title: 'Конфигурация экспортирована!' });
  };

  const importConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const config = JSON.parse(event.target?.result as string);
          if (config.colors) setColors(config.colors);
          if (config.components) setComponents(config.components);
          if (config.layout) setLayout(config.layout);
          if (config.advanced) setAdvanced(config.advanced);
          toast({ title: 'Конфигурация импортирована!' });
        } catch (e) {
          toast({ title: 'Ошибка импорта', variant: 'destructive' });
        }
      };
      reader.readAsText(file);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Сбросить все настройки к дефолту?')) {
      setColors({
        primary: '#6366f1',
        secondary: '#a855f7',
        accent: '#ec4899',
        background: '#ffffff',
        text: '#000000',
      });
      setLayout({
        headerHeight: '80',
        maxWidth: '1280',
        borderRadius: '12',
        spacing: '24',
        fontSize: '16',
      });
      setComponents({
        showHeader: true,
        showFooter: true,
        showGamification: true,
        showProfile: true,
        showTools: true,
        showQuickButtons: true,
        showContactButtons: true,
      });
      setAdvanced({
        customCSS: '',
        customJS: '',
        headTags: '',
      });
      toast({ title: 'Настройки сброшены!' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeSection === 'colors' ? 'default' : 'outline'}
          onClick={() => setActiveSection('colors')}
        >
          <Icon name="Palette" size={16} className="mr-2" />
          Цвета
        </Button>
        <Button
          variant={activeSection === 'layout' ? 'default' : 'outline'}
          onClick={() => setActiveSection('layout')}
        >
          <Icon name="Layout" size={16} className="mr-2" />
          Лейаут
        </Button>
        <Button
          variant={activeSection === 'components' ? 'default' : 'outline'}
          onClick={() => setActiveSection('components')}
        >
          <Icon name="Component" size={16} className="mr-2" />
          Компоненты
        </Button>
        <Button
          variant={activeSection === 'advanced' ? 'default' : 'outline'}
          onClick={() => setActiveSection('advanced')}
        >
          <Icon name="Code" size={16} className="mr-2" />
          Продвинутое
        </Button>
      </div>

      {/* Colors Section */}
      {activeSection === 'colors' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">🎨 Управление цветами</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-2 capitalize">{key}</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-20"
                  />
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Layout Section */}
      {activeSection === 'layout' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">📐 Настройки лейаута</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Высота Header (px)</label>
              <Input
                type="number"
                value={layout.headerHeight}
                onChange={(e) => handleLayoutChange('headerHeight', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max ширина (px)</label>
              <Input
                type="number"
                value={layout.maxWidth}
                onChange={(e) => handleLayoutChange('maxWidth', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Радиус скругления (px)</label>
              <Input
                type="number"
                value={layout.borderRadius}
                onChange={(e) => handleLayoutChange('borderRadius', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Отступы (px)</label>
              <Input
                type="number"
                value={layout.spacing}
                onChange={(e) => handleLayoutChange('spacing', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Размер шрифта (px)</label>
              <Input
                type="number"
                value={layout.fontSize}
                onChange={(e) => handleLayoutChange('fontSize', e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Components Section */}
      {activeSection === 'components' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">🧩 Включить/выключить компоненты</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(components).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="capitalize">{key.replace('show', '').replace(/([A-Z])/g, ' $1').trim()}</span>
                <Button
                  variant={value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleComponentToggle(key)}
                >
                  {value ? 'Включено' : 'Выключено'}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Advanced Section */}
      {activeSection === 'advanced' && (
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">💻 Пользовательский CSS</h3>
            <Textarea
              value={advanced.customCSS}
              onChange={(e) => setAdvanced(prev => ({ ...prev, customCSS: e.target.value }))}
              placeholder=".custom-class { color: red; }"
              rows={8}
              className="font-mono text-sm"
            />
            <Button onClick={applyCustomCSS} className="mt-3">
              <Icon name="Check" size={16} className="mr-2" />
              Применить CSS
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">⚡ Пользовательский JavaScript</h3>
            <Textarea
              value={advanced.customJS}
              onChange={(e) => setAdvanced(prev => ({ ...prev, customJS: e.target.value }))}
              placeholder="console.log('Hello from admin!');"
              rows={8}
              className="font-mono text-sm"
            />
            <Button onClick={applyCustomJS} className="mt-3">
              <Icon name="Play" size={16} className="mr-2" />
              Выполнить JS
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">📝 Дополнительные HEAD теги</h3>
            <Textarea
              value={advanced.headTags}
              onChange={(e) => setAdvanced(prev => ({ ...prev, headTags: e.target.value }))}
              placeholder='<meta name="description" content="...">'
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-sm text-gray-500 mt-2">
              Добавьте meta теги, скрипты или стили прямо в HEAD
            </p>
          </Card>
        </div>
      )}

      {/* Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">🔧 Действия</h3>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={exportConfig} variant="outline">
            <Icon name="Download" size={16} className="mr-2" />
            Экспорт конфигурации
          </Button>
          <Button variant="outline" asChild>
            <label>
              <Icon name="Upload" size={16} className="mr-2" />
              Импорт конфигурации
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={importConfig}
              />
            </label>
          </Button>
          <Button onClick={resetToDefaults} variant="destructive">
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Сбросить всё
          </Button>
        </div>
      </Card>

      {/* Live Preview Info */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Полный контроль</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Все изменения применяются мгновенно</li>
              <li>• Сохраняйте конфигурацию в JSON</li>
              <li>• Используйте custom CSS/JS для любых доработок</li>
              <li>• Включайте/выключайте компоненты по желанию</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
