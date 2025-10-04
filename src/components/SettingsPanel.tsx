import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

interface SettingsPanelProps {
  onClose: () => void;
}

const voiceLanguages = [
  { code: 'ru-RU', name: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italiano (Italian)', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Português (Portuguese)', flag: '🇧🇷' },
  { code: 'zh-CN', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'ja-JP', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'ar-SA', name: 'العربية (Arabic)', flag: '🇸🇦' },
];

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { language, setLanguage, voiceLanguage, setVoiceLanguage, t } = useLanguage();
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 border-2 border-purple-200 dark:border-purple-800 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Icon name="Settings" className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Interface Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('settings.language')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={language === 'ru' ? 'default' : 'outline'}
                className={language === 'ru' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
                onClick={() => setLanguage('ru')}
              >
                🇷🇺 Русский
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                className={language === 'en' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
                onClick={() => setLanguage('en')}
              >
                🇺🇸 English
              </Button>
            </div>
          </div>

          {/* Voice Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('settings.voiceLanguage')}
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {voiceLanguages.map(lang => (
                <Button
                  key={lang.code}
                  variant={voiceLanguage === lang.code ? 'default' : 'outline'}
                  className={`justify-start ${voiceLanguage === lang.code ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}`}
                  onClick={() => setVoiceLanguage(lang.code)}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('settings.theme')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                className={theme === 'light' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
                onClick={() => setTheme('light')}
              >
                <Icon name="Sun" className="mr-2" size={18} />
                {t('settings.light')}
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                className={theme === 'dark' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
                onClick={() => setTheme('dark')}
              >
                <Icon name="Moon" className="mr-2" size={18} />
                {t('settings.dark')}
              </Button>
            </div>
          </div>

          {/* Color Scheme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Цветовая схема
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={colorScheme === 'purple' ? 'default' : 'outline'}
                className={colorScheme === 'purple' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
                onClick={() => setColorScheme('purple')}
              >
                🟣 Фиолетовая
              </Button>
              <Button
                variant={colorScheme === 'blue' ? 'default' : 'outline'}
                className={colorScheme === 'blue' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : ''}
                onClick={() => setColorScheme('blue')}
              >
                🔵 Синяя
              </Button>
              <Button
                variant={colorScheme === 'green' ? 'default' : 'outline'}
                className={colorScheme === 'green' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : ''}
                onClick={() => setColorScheme('green')}
              >
                🟢 Зелёная
              </Button>
              <Button
                variant={colorScheme === 'pink' ? 'default' : 'outline'}
                className={colorScheme === 'pink' ? 'bg-gradient-to-r from-pink-600 to-rose-600' : ''}
                onClick={() => setColorScheme('pink')}
              >
                🩷 Розовая
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}