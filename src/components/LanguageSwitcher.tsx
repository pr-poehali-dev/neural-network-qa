import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useTranslation } from '@/hooks/useTranslation';
import { Language } from '@/i18n/translations';
import { useToast } from '@/hooks/use-toast';

const LANGUAGES = [
  { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' },
  { code: 'en' as Language, flag: '🇬🇧', name: 'English' },
  { code: 'es' as Language, flag: '🇪🇸', name: 'Español' },
  { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' },
  { code: 'zh' as Language, flag: '🇨🇳', name: '中文' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const { toast } = useToast();
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedLanguage = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 gap-2"
      >
        <span className="text-lg">{selectedLanguage.flag}</span>
        <span className="hidden sm:inline">{selectedLanguage.name}</span>
        <Icon name="ChevronDown" size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </Button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute top-full right-0 mt-2 bg-gray-800/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl z-50 overflow-hidden min-w-[160px]">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setShowDropdown(false);
                  toast({
                    title: '✓ Язык изменён',
                    description: `Теперь используется: ${lang.name}`
                  });
                }}
                className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3 ${
                  language === lang.code ? 'bg-white/10 text-white' : 'text-gray-300'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
                {language === lang.code && (
                  <Icon name="Check" size={16} className="ml-auto text-green-400" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}