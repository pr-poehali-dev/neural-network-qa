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

  const testApiKey = async (keyNumber: 1 | 2) => {
    const apiKey = keyNumber === 1 ? settings.openrouterApiKey : settings.openrouterApiKey2;
    
    if (!apiKey) {
      toast({
        title: `❌ API ключ #${keyNumber} не заполнен`,
        description: 'Введите ключ перед тестированием',
        variant: 'destructive'
      });
      return;
    }

    const testModel = settings.aiModel || 'google/gemini-2.0-flash-exp:free';
    
    toast({
      title: `🔍 Тестирование API ключа #${keyNumber}...`,
      description: `Проверяю подключение к модели ${testModel}`
    });

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Chat Test'
        },
        body: JSON.stringify({
          model: testModel,
          messages: [{ role: 'user', content: 'Привет! Это тестовое сообщение.' }],
          max_tokens: 50
        })
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMsg = error.error?.message || `HTTP ${response.status}`;
        
        if (response.status === 401) {
          throw new Error('❌ Неверный API ключ');
        } else if (response.status === 402) {
          throw new Error('❌ Недостаточно кредитов на балансе');
        } else if (response.status === 404) {
          throw new Error('❌ Модель не найдена');
        } else if (response.status === 429) {
          throw new Error('⚠️ Превышен лимит запросов (попробуйте позже)');
        } else {
          throw new Error(errorMsg);
        }
      }

      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content || 'Нет ответа';
      const tokensUsed = data.usage?.total_tokens || 0;

      toast({
        title: `✅ API ключ #${keyNumber} работает!`,
        description: `Ответ: "${responseText.substring(0, 50)}..." | Токены: ${tokensUsed}`,
        duration: 8000
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      toast({
        title: `❌ Ошибка API ключа #${keyNumber}`,
        description: errorMessage,
        variant: 'destructive',
        duration: 10000
      });
    }
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
              <div className="flex items-center justify-between mb-2">
                <Label>OpenRouter API Key #1 (основной)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testApiKey(1)}
                  className="text-xs"
                  disabled={!settings.openrouterApiKey}
                >
                  <Icon name="Zap" size={14} className="mr-1" />
                  Тест
                </Button>
              </div>
              <Input
                type="password"
                value={settings.openrouterApiKey || ''}
                onChange={(e) => onUpdateSettings({ ...settings, openrouterApiKey: e.target.value })}
                className="border-purple-200"
                placeholder="sk-or-v1-..."
              />
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs font-medium text-blue-900 mb-1">
                  🎁 Как получить бесплатный доступ:
                </p>
                <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
                  <li>Зарегистрируйтесь на <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">openrouter.ai</a></li>
                  <li>Создайте API ключ (Credits → Create Key)</li>
                  <li>Скопируйте ключ и вставьте сюда</li>
                  <li>Выберите бесплатную модель ниже ⬇️</li>
                </ol>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>OpenRouter API Key #2 (резервный, опционально)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testApiKey(2)}
                  className="text-xs"
                  disabled={!settings.openrouterApiKey2}
                >
                  <Icon name="Zap" size={14} className="mr-1" />
                  Тест
                </Button>
              </div>
              <Input
                type="password"
                value={settings.openrouterApiKey2 || ''}
                onChange={(e) => onUpdateSettings({ ...settings, openrouterApiKey2: e.target.value })}
                className="border-purple-200"
                placeholder="sk-or-v1-..."
              />
              <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-xs font-medium text-orange-900 mb-1">
                  🔄 Резервный ключ для надёжности:
                </p>
                <ul className="text-xs text-orange-800 space-y-1 ml-4 list-disc">
                  <li>При ошибке 429 на первом ключе автоматически используется второй</li>
                  <li>Создайте второй аккаунт на openrouter.ai для удвоения лимитов</li>
                  <li>Необязательно - работает и с одним ключом</li>
                </ul>
              </div>
            </div>

            <div>
              <Label className="mb-2">Резервная модель AI (при ошибке 429)</Label>
              <select
                value={settings.fallbackAiModel || 'meta-llama/llama-3.3-70b-instruct:free'}
                onChange={(e) => onUpdateSettings({ ...settings, fallbackAiModel: e.target.value })}
                className="w-full border border-purple-200 rounded-md p-2 bg-white dark:bg-gray-800 dark:text-white"
              >
                <optgroup label="🎁 Бесплатные модели">
                  <option value="meta-llama/llama-3.3-70b-instruct:free">Meta Llama 3.3 70B (рекомендуется) 🔥</option>
                  <option value="google/gemini-2.0-flash-exp:free">Google Gemini 2.0 Flash ⭐</option>
                  <option value="meta-llama/llama-3.1-8b-instruct:free">Meta Llama 3.1 8B</option>
                  <option value="meta-llama/llama-3.1-70b-instruct:free">Meta Llama 3.1 70B</option>
                  <option value="microsoft/phi-3-medium-128k-instruct:free">Microsoft Phi-3</option>
                </optgroup>
              </select>
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-xs font-medium text-green-900 mb-1">
                  🔄 Автоматическое переключение при ошибках:
                </p>
                <ul className="text-xs text-green-800 space-y-1 ml-4 list-disc">
                  <li>При ошибке 429 (лимит запросов) чат автоматически переключится на резервную модель</li>
                  <li>Выберите модель, отличную от основной, для лучшей надёжности</li>
                  <li>Все модели используют один OpenRouter API ключ</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 <strong>Рекомендация:</strong> Llama 3.3 70B как резервная для Gemini (или наоборот)
              </p>
            </div>

            <div>
              <Label className="mb-2">Модель AI</Label>
              <select
                value={settings.aiModel || 'google/gemini-2.0-flash-exp:free'}
                onChange={(e) => onUpdateSettings({ ...settings, aiModel: e.target.value })}
                className="w-full border border-purple-200 rounded-md p-2 bg-white dark:bg-gray-800 dark:text-white"
              >
                <optgroup label="🎁 Бесплатные модели (навсегда!)">
                  <option value="google/gemini-2.0-flash-exp:free">Google Gemini 2.0 Flash (бесплатно, быстро) ⭐</option>
                  <option value="meta-llama/llama-3.3-70b-instruct:free">Meta Llama 3.3 70B Instruct (бесплатно, мощнее) 🔥</option>
                  <option value="meta-llama/llama-3.1-8b-instruct:free">Meta Llama 3.1 8B (бесплатно)</option>
                  <option value="meta-llama/llama-3.1-70b-instruct:free">Meta Llama 3.1 70B (бесплатно)</option>
                  <option value="microsoft/phi-3-medium-128k-instruct:free">Microsoft Phi-3 (бесплатно)</option>
                </optgroup>
                <optgroup label="💰 Очень дешёвые ($0.14/1M)">
                  <option value="deepseek/deepseek-chat">DeepSeek Chat (дешевле всех)</option>
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
                <optgroup label="Google">
                  <option value="google/gemini-pro">Gemini Pro</option>
                  <option value="google/gemini-pro-1.5">Gemini Pro 1.5</option>
                </optgroup>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                🎁 = бесплатно навсегда | 💰 = почти бесплатно ($0.21 за 1000 сообщений)
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