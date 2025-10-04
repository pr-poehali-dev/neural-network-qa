import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

interface SettingsPanelProps {
  onClose: () => void;
}

const voiceLanguages = [
  { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'pt-PT', name: 'Português (Portugal)', flag: '🇵🇹' },
  { code: 'zh-CN', name: '中文 (简体)', flag: '🇨🇳' },
  { code: 'zh-TW', name: '中文 (繁體)', flag: '🇹🇼' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr-TR', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl-PL', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl-NL', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv-SE', name: 'Svenska', flag: '🇸🇪' },
  { code: 'no-NO', name: 'Norsk', flag: '🇳🇴' },
  { code: 'da-DK', name: 'Dansk', flag: '🇩🇰' },
  { code: 'fi-FI', name: 'Suomi', flag: '🇫🇮' },
  { code: 'cs-CZ', name: 'Čeština', flag: '🇨🇿' },
  { code: 'uk-UA', name: 'Українська', flag: '🇺🇦' },
  { code: 'he-IL', name: 'עברית', flag: '🇮🇱' },
  { code: 'th-TH', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi-VN', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id-ID', name: 'Bahasa Indonesia', flag: '🇮🇩' },
];

const translateLanguages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
];

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { language, setLanguage, voiceLanguage, setVoiceLanguage, translateToLanguage, autoDetectLanguage, setTranslateToLanguage, setAutoDetectLanguage, t } = useLanguage();
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
              <Button
                variant={language === 'es' ? 'default' : 'outline'}
                className={language === 'es' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
                onClick={() => setLanguage('es')}
              >
                🇪🇸 Español
              </Button>
              <Button
                variant={language === 'fr' ? 'default' : 'outline'}
                className={language === 'fr' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
                onClick={() => setLanguage('fr')}
              >
                🇫🇷 Français
              </Button>
              <Button
                variant={language === 'de' ? 'default' : 'outline'}
                className={language === 'de' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
                onClick={() => setLanguage('de')}
              >
                🇩🇪 Deutsch
              </Button>
              <Button
                variant={language === 'zh' ? 'default' : 'outline'}
                className={language === 'zh' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
                onClick={() => setLanguage('zh')}
              >
                🇨🇳 中文
              </Button>
              <Button
                variant={language === 'ja' ? 'default' : 'outline'}
                className={language === 'ja' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
                onClick={() => setLanguage('ja')}
              >
                🇯🇵 日本語
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

          {/* Voice Translation Settings */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Icon name="Languages" size={20} />
              Перевод голосовых сообщений
            </h3>
            
            {/* Auto-detect toggle */}
            <div className="mb-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Автоопределение языка
                </span>
                <Button
                  variant={autoDetectLanguage ? 'default' : 'outline'}
                  size="sm"
                  className={autoDetectLanguage ? 'bg-gradient-to-r from-green-600 to-emerald-600' : ''}
                  onClick={() => setAutoDetectLanguage(!autoDetectLanguage)}
                >
                  {autoDetectLanguage ? 'Вкл' : 'Выкл'}
                </Button>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Автоматически определять язык из голосового сообщения
              </p>
            </div>

            {/* Translate to language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Переводить на язык
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {translateLanguages.map(lang => (
                  <Button
                    key={lang.code}
                    variant={translateToLanguage === lang.code ? 'default' : 'outline'}
                    className={`justify-start text-sm ${translateToLanguage === lang.code ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}`}
                    onClick={() => setTranslateToLanguage(lang.code)}
                    size="sm"
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                ⚠️ Для работы перевода необходим API ключ (OpenAI или Google Cloud)
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}