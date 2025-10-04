import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ru' | 'en';

interface Translations {
  [key: string]: {
    ru: string;
    en: string;
  };
}

const translations: Translations = {
  // Header
  'header.title': { ru: 'Богдан ИИ', en: 'Bogdan AI' },
  'header.online': { ru: 'Онлайн', en: 'Online' },
  'header.offline': { ru: 'Офлайн', en: 'Offline' },
  'header.checking': { ru: 'Проверка...', en: 'Checking...' },
  'header.history': { ru: 'История', en: 'History' },
  'header.home': { ru: 'Главная', en: 'Home' },
  'header.about': { ru: 'О сервисе', en: 'About' },
  'header.admin': { ru: 'Админ', en: 'Admin' },
  
  // Main page
  'main.title': { ru: 'Богдан AI', en: 'Bogdan AI' },
  'main.subtitle': { ru: 'Твой личный AI-помощник для общения и решения задач', en: 'Your personal AI assistant for communication and tasks' },
  
  // Chat
  'chat.title': { ru: 'Чат', en: 'Chat' },
  'chat.save': { ru: 'Сохранить', en: 'Save' },
  'chat.export': { ru: 'Экспорт', en: 'Export' },
  'chat.new': { ru: 'Новый', en: 'New' },
  'chat.start': { ru: 'Начните диалог', en: 'Start a conversation' },
  'chat.askQuestion': { ru: 'Задайте вопрос', en: 'Ask a question' },
  'chat.placeholder': { ru: 'Задайте вопрос...', en: 'Ask a question...' },
  'chat.answer': { ru: 'Ответить', en: 'Answer' },
  'chat.speak': { ru: 'Озвучить', en: 'Speak' },
  'chat.stop': { ru: 'Остановить', en: 'Stop' },
  'chat.listening': { ru: 'Слушаю...', en: 'Listening...' },
  'chat.voiceInput': { ru: 'Голосовой ввод', en: 'Voice input' },
  'chat.copy': { ru: 'Копировать', en: 'Copy' },
  
  // Examples
  'examples.title': { ru: 'Попробуйте спросить', en: 'Try asking' },
  'examples.prices': { ru: 'Что такое искусственный интеллект?', en: 'What is artificial intelligence?' },
  'examples.pricesDesc': { ru: 'Узнайте больше об AI', en: 'Learn more about AI' },
  'examples.contacts': { ru: 'Как начать изучать программирование?', en: 'How to start learning programming?' },
  'examples.contactsDesc': { ru: 'Советы для начинающих', en: 'Tips for beginners' },
  'examples.summary': { ru: 'Расскажи интересный факт', en: 'Tell me an interesting fact' },
  'examples.summaryDesc': { ru: 'Развивайте кругозор', en: 'Expand your knowledge' },
  'examples.dates': { ru: 'Помоги составить план на день', en: 'Help me plan my day' },
  'examples.datesDesc': { ru: 'Организуйте время', en: 'Organize your time' },
  
  // Settings
  'settings.title': { ru: 'Настройки', en: 'Settings' },
  'settings.language': { ru: 'Язык интерфейса', en: 'Interface Language' },
  'settings.voiceLanguage': { ru: 'Язык озвучки', en: 'Voice Language' },
  'settings.theme': { ru: 'Тема', en: 'Theme' },
  'settings.light': { ru: 'Светлая', en: 'Light' },
  'settings.dark': { ru: 'Темная', en: 'Dark' },
  
  // Admin
  'admin.title': { ru: 'Админ-панель Богдана', en: 'Bogdan Admin Panel' },
  'admin.files': { ru: 'Файлы', en: 'Files' },
  'admin.stats': { ru: 'Статистика', en: 'Statistics' },
  'admin.settings': { ru: 'Настройки', en: 'Settings' },
  'admin.logout': { ru: 'Выйти', en: 'Logout' },
  
  // Toasts
  'toast.saved': { ru: 'Чат сохранен', en: 'Chat saved' },
  'toast.deleted': { ru: 'Чат удалён', en: 'Chat deleted' },
  'toast.copied': { ru: 'Скопировано', en: 'Copied' },
};

interface LanguageContextType {
  language: Language;
  voiceLanguage: string;
  setLanguage: (lang: Language) => void;
  setVoiceLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');
  const [voiceLanguage, setVoiceLanguageState] = useState<string>('ru-RU');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    const savedVoiceLang = localStorage.getItem('voiceLanguage');
    if (savedLang) setLanguageState(savedLang);
    if (savedVoiceLang) setVoiceLanguageState(savedVoiceLang);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setVoiceLanguage = (lang: string) => {
    setVoiceLanguageState(lang);
    localStorage.setItem('voiceLanguage', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, voiceLanguage, setLanguage, setVoiceLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}