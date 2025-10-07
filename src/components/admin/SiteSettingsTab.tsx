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
  whatsappNumber?: string;
  telegramUsername?: string;
  telegramBotId?: string;
  telegramAdminChatId?: string;
  openrouterApiKey?: string;
  aiModel?: string;
  enableAiChat?: boolean;
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

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2">WhatsApp (номер с кодом страны)</Label>
            <Input
              value={settings.whatsappNumber || ''}
              onChange={(e) => onUpdateSettings({ ...settings, whatsappNumber: e.target.value })}
              className="border-purple-200"
              placeholder="79991234567"
            />
            <p className="text-xs text-gray-500 mt-1">Пример: 79991234567 (без + и пробелов)</p>
          </div>

          <div>
            <Label className="mb-2">Telegram (username)</Label>
            <Input
              value={settings.telegramUsername || ''}
              onChange={(e) => onUpdateSettings({ ...settings, telegramUsername: e.target.value })}
              className="border-purple-200"
              placeholder="@username или username"
            />
            <p className="text-xs text-gray-500 mt-1">Появится плавающая кнопка справа внизу</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2">Telegram Bot ID (для живого оператора)</Label>
            <Input
              value={settings.telegramBotId || ''}
              onChange={(e) => onUpdateSettings({ ...settings, telegramBotId: e.target.value })}
              className="border-purple-200"
              placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
            />
            <p className="text-xs text-gray-500 mt-1">Получите у @BotFather в Telegram</p>
          </div>

          <div>
            <Label className="mb-2">Telegram Admin Chat ID</Label>
            <Input
              value={settings.telegramAdminChatId || ''}
              onChange={(e) => onUpdateSettings({ ...settings, telegramAdminChatId: e.target.value })}
              className="border-purple-200"
              placeholder="123456789"
            />
            <p className="text-xs text-gray-500 mt-1">Напишите /start боту, чтобы узнать ID</p>
          </div>
        </div>

        <div className="border-t border-purple-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="Bot" size={20} className="text-purple-600" />
            Настройки AI чат-бота
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-purple-200 rounded-lg">
              <div>
                <Label>Включить AI чат</Label>
                <p className="text-xs text-gray-500 mt-1">Плавающая кнопка AI-ассистента</p>
              </div>
              <Switch
                checked={settings.enableAiChat || false}
                onCheckedChange={(checked) => onUpdateSettings({ ...settings, enableAiChat: checked })}
              />
            </div>

            <div>
              <Label className="mb-2">OpenRouter API Key</Label>
              <Input
                type="password"
                value={settings.openrouterApiKey || ''}
                onChange={(e) => onUpdateSettings({ ...settings, openrouterApiKey: e.target.value })}
                className="border-purple-200"
                placeholder="sk-or-v1-..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Получите ключ на{' '}
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  openrouter.ai/keys
                </a>
                {' '}|{' '}
                <a 
                  href="/ai-test" 
                  target="_blank"
                  className="text-green-600 hover:underline font-medium"
                >
                  🧪 Протестировать AI
                </a>
              </p>
            </div>

            <div>
              <Label className="mb-2">Модель AI</Label>
              <select
                value={settings.aiModel || 'deepseek/deepseek-chat'}
                onChange={(e) => onUpdateSettings({ ...settings, aiModel: e.target.value })}
                className="w-full border border-purple-200 rounded-md p-2 bg-white dark:bg-gray-800 dark:text-white"
              >
                <optgroup label="🔥 DeepSeek (рекомендуется)">
                  <option value="deepseek/deepseek-r1">DeepSeek R1 (новая, мощная)</option>
                  <option value="deepseek/deepseek-chat">DeepSeek Chat (очень дешево)</option>
                  <option value="deepseek/deepseek-coder">DeepSeek Coder (для кода)</option>
                </optgroup>
                <optgroup label="OpenAI">
                  <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="openai/gpt-4">GPT-4</option>
                  <option value="openai/gpt-4-turbo">GPT-4 Turbo</option>
                </optgroup>
                <optgroup label="Anthropic">
                  <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                  <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="anthropic/claude-3-opus">Claude 3 Opus</option>
                </optgroup>
                <optgroup label="Meta">
                  <option value="meta-llama/llama-3-70b-instruct">Llama 3 70B (бесплатно)</option>
                  <option value="meta-llama/llama-3-8b-instruct">Llama 3 8B (быстро)</option>
                </optgroup>
                <optgroup label="Google">
                  <option value="google/gemini-pro">Gemini Pro</option>
                  <option value="google/gemini-pro-1.5">Gemini Pro 1.5</option>
                </optgroup>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Выберите модель по балансу цена/качество
              </p>
            </div>
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