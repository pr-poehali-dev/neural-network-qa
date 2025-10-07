import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export type SiteLanguage = 'ru' | 'en' | 'es' | 'de' | 'fr' | 'zh' | 'ja' | 'ko' | 'ar' | 'pt';

interface SiteTranslationContextType {
  language: SiteLanguage;
  setLanguage: (lang: SiteLanguage) => void;
  translateText: (text: string) => Promise<string>;
  isTranslating: boolean;
}

const SiteTranslationContext = createContext<SiteTranslationContextType | undefined>(undefined);

const LANGUAGE_NAMES: Record<SiteLanguage, { name: string; flag: string }> = {
  ru: { name: 'Русский', flag: '🇷🇺' },
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  fr: { name: 'Français', flag: '🇫🇷' },
  zh: { name: '中文', flag: '🇨🇳' },
  ja: { name: '日本語', flag: '🇯🇵' },
  ko: { name: '한국어', flag: '🇰🇷' },
  ar: { name: 'العربية', flag: '🇸🇦' },
  pt: { name: 'Português', flag: '🇵🇹' }
};

export { LANGUAGE_NAMES };

export function SiteTranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>(() => {
    const saved = localStorage.getItem('site_language');
    return (saved && saved in LANGUAGE_NAMES ? saved : 'ru') as SiteLanguage;
  });
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache] = useState(new Map<string, string>());

  useEffect(() => {
    localStorage.setItem('site_language', language);
  }, [language]);

  const translateText = async (text: string): Promise<string> => {
    if (language === 'ru') return text;
    
    const cacheKey = `${text}:${language}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    try {
      setIsTranslating(true);
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ru&tl=${language}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();
      const translated = data[0].map((item: any) => item[0]).join('');
      
      translationCache.set(cacheKey, translated);
      setIsTranslating(false);
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      setIsTranslating(false);
      return text;
    }
  };

  const setLanguage = (lang: SiteLanguage) => {
    setLanguageState(lang);
    translationCache.clear();
  };

  const value = {
    language,
    setLanguage,
    translateText,
    isTranslating
  };

  return (
    <SiteTranslationContext.Provider value={value}>
      {children}
    </SiteTranslationContext.Provider>
  );
}

export function useSiteTranslation() {
  const context = useContext(SiteTranslationContext);
  if (!context) {
    throw new Error('useSiteTranslation must be used within SiteTranslationProvider');
  }
  return context;
}
