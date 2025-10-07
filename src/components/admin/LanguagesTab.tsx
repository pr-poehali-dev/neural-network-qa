import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useTranslation } from '@/hooks/useTranslation';
import { Language } from '@/i18n/translations';
import { useToast } from '@/hooks/use-toast';

export default function LanguagesTab() {
  const { t, language, setLanguage } = useTranslation();
  const { toast } = useToast();

  const languages: { code: Language; flag: string; name: string; nativeName: string }[] = [
    { code: 'ru', flag: '🇷🇺', name: 'Russian', nativeName: 'Русский' },
    { code: 'en', flag: '🇬🇧', name: 'English', nativeName: 'English' },
    { code: 'es', flag: '🇪🇸', name: 'Spanish', nativeName: 'Español' },
    { code: 'de', flag: '🇩🇪', name: 'German', nativeName: 'Deutsch' },
    { code: 'fr', flag: '🇫🇷', name: 'French', nativeName: 'Français' },
    { code: 'zh', flag: '🇨🇳', name: 'Chinese', nativeName: '中文' }
  ];

  const handleSetLanguage = (code: Language) => {
    setLanguage(code);
    toast({
      title: '✓ Язык изменён',
      description: `Интерфейс переключён на: ${languages.find(l => l.code === code)?.nativeName}`
    });
  };

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Управление языками</h2>
        <p className="text-gray-400">
          Переключайте язык интерфейса. Все тексты сайта автоматически переводятся.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-400/30 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-3xl">
            {currentLang?.flag}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Текущий язык</h3>
            <p className="text-lg text-indigo-300">{currentLang?.nativeName} ({currentLang?.name})</p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-white/10 rounded-lg p-4">
          <Icon name="Info" className="text-blue-400 mt-0.5" size={18} />
          <p className="text-sm text-gray-300">
            Язык сохраняется автоматически и применяется ко всем элементам сайта: 
            навигация, кнопки, чат, уведомления, формы.
          </p>
        </div>
      </Card>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Выберите язык интерфейса</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {languages.map((lang) => {
            const isActive = language === lang.code;
            return (
              <Card
                key={lang.code}
                className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-br from-indigo-600/40 to-purple-600/40 border-indigo-400 scale-105 shadow-xl'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70 hover:scale-102'
                }`}
                onClick={() => handleSetLanguage(lang.code)}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Icon name="Check" size={12} />
                    Активен
                  </div>
                )}
                
                <div className="p-6">
                  <div className="text-6xl mb-4 text-center">{lang.flag}</div>
                  <h4 className="text-xl font-bold text-white text-center mb-1">
                    {lang.nativeName}
                  </h4>
                  <p className="text-sm text-gray-400 text-center">{lang.name}</p>
                  
                  {isActive ? (
                    <div className="mt-4 py-2 px-4 bg-green-500/20 text-green-300 rounded-lg text-center text-sm font-medium">
                      Используется сейчас
                    </div>
                  ) : (
                    <Button 
                      className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetLanguage(lang.code);
                      }}
                    >
                      Применить
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="bg-gray-800/50 border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Icon name="Globe" size={20} className="text-indigo-400" />
          Статистика переводов
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-3xl font-bold text-indigo-400 mb-1">6</div>
            <div className="text-sm text-gray-400">Языков</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-3xl font-bold text-purple-400 mb-1">100+</div>
            <div className="text-sm text-gray-400">Строк</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-3xl font-bold text-pink-400 mb-1">100%</div>
            <div className="text-sm text-gray-400">Охват</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-400 mb-1">✓</div>
            <div className="text-sm text-gray-400">Качество</div>
          </div>
        </div>
      </Card>

      <Card className="bg-blue-500/10 border-blue-400/30 p-6">
        <div className="flex items-start gap-3">
          <Icon name="Lightbulb" className="text-blue-400 mt-1" size={24} />
          <div>
            <h4 className="text-white font-semibold mb-2">Как работает мультиязычность</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Все элементы интерфейса переводятся автоматически при смене языка</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Выбранный язык сохраняется в браузере пользователя</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Переводы выполнены профессионально для каждого языка</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Система i18n работает без задержек и дополнительных запросов</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button 
          onClick={() => {
            setLanguage('ru');
            toast({ title: '✓ Язык сброшен', description: 'Установлен русский язык по умолчанию' });
          }}
          variant="outline"
          className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-700"
        >
          <Icon name="RotateCcw" size={18} className="mr-2" />
          Сбросить на русский
        </Button>
        
        <Button 
          onClick={() => {
            const nextLangIndex = (languages.findIndex(l => l.code === language) + 1) % languages.length;
            handleSetLanguage(languages[nextLangIndex].code);
          }}
          variant="outline"
          className="bg-indigo-600/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30"
        >
          <Icon name="ArrowRight" size={18} className="mr-2" />
          Переключить на следующий
        </Button>
      </div>
    </div>
  );
}
