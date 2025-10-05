import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ru' | 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

interface Translations {
  [key: string]: {
    ru: string;
    en: string;
    es: string;
    fr: string;
    de: string;
    zh: string;
    ja: string;
  };
}

const translations: Translations = {
  // Header
  'header.title': { ru: 'Богдан ИИ', en: 'Bogdan AI', es: 'Bogdan IA', fr: 'Bogdan IA', de: 'Bogdan KI', zh: '博丹 AI', ja: 'ボグダン AI' },
  'header.online': { ru: 'Онлайн', en: 'Online', es: 'En línea', fr: 'En ligne', de: 'Online', zh: '在线', ja: 'オンライン' },
  'header.offline': { ru: 'Офлайн', en: 'Offline', es: 'Fuera de línea', fr: 'Hors ligne', de: 'Offline', zh: '离线', ja: 'オフライン' },
  'header.checking': { ru: 'Проверка...', en: 'Checking...', es: 'Verificando...', fr: 'Vérification...', de: 'Überprüfung...', zh: '检查中...', ja: '確認中...' },
  'header.history': { ru: 'История', en: 'History', es: 'Historial', fr: 'Historique', de: 'Verlauf', zh: '历史', ja: '履歴' },
  'header.home': { ru: 'Главная', en: 'Home', es: 'Inicio', fr: 'Accueil', de: 'Startseite', zh: '主页', ja: 'ホーム' },
  'header.about': { ru: 'О сервисе', en: 'About', es: 'Acerca de', fr: 'À propos', de: 'Über', zh: '关于', ja: 'アプリについて' },
  'header.admin': { ru: 'Админ', en: 'Admin', es: 'Admin', fr: 'Admin', de: 'Admin', zh: '管理', ja: '管理' },
  
  // Main page
  'main.title': { ru: 'Богдан AI', en: 'Bogdan AI', es: 'Bogdan IA', fr: 'Bogdan IA', de: 'Bogdan KI', zh: '博丹 AI', ja: 'ボグダン AI' },
  'main.subtitle': { ru: 'Твой ассистент', en: 'Your assistant', es: 'Tu asistente', fr: 'Votre assistant', de: 'Dein Assistent', zh: '你的助手', ja: 'あなたのアシスタント' },
  
  // Chat
  'chat.title': { ru: 'Чат', en: 'Chat', es: 'Chat', fr: 'Chat', de: 'Chat', zh: '聊天', ja: 'チャット' },
  'chat.save': { ru: 'Сохранить', en: 'Save', es: 'Guardar', fr: 'Enregistrer', de: 'Speichern', zh: '保存', ja: '保存' },
  'chat.export': { ru: 'Экспорт', en: 'Export', es: 'Exportar', fr: 'Exporter', de: 'Exportieren', zh: '导出', ja: 'エクスポート' },
  'chat.new': { ru: 'Новый', en: 'New', es: 'Nuevo', fr: 'Nouveau', de: 'Neu', zh: '新建', ja: '新規' },
  'chat.start': { ru: 'Начните диалог', en: 'Start a conversation', es: 'Iniciar conversación', fr: 'Commencer une conversation', de: 'Gespräch starten', zh: '开始对话', ja: '会話を始める' },
  'chat.askQuestion': { ru: 'Задайте вопрос', en: 'Ask a question', es: 'Hacer una pregunta', fr: 'Poser une question', de: 'Eine Frage stellen', zh: '提问', ja: '質問する' },
  'chat.placeholder': { ru: 'Задайте вопрос...', en: 'Ask a question...', es: 'Hacer una pregunta...', fr: 'Poser une question...', de: 'Eine Frage stellen...', zh: '提问...', ja: '質問する...' },
  'chat.answer': { ru: 'Ответить', en: 'Answer', es: 'Responder', fr: 'Répondre', de: 'Antworten', zh: '回答', ja: '返信' },
  'chat.speak': { ru: 'Озвучить', en: 'Speak', es: 'Hablar', fr: 'Parler', de: 'Sprechen', zh: '朗读', ja: '読み上げ' },
  'chat.stop': { ru: 'Остановить', en: 'Stop', es: 'Detener', fr: 'Arrêter', de: 'Stoppen', zh: '停止', ja: '停止' },
  'chat.listening': { ru: 'Слушаю...', en: 'Listening...', es: 'Escuchando...', fr: 'Écoute...', de: 'Höre zu...', zh: '聆听中...', ja: '聞いています...' },
  'chat.voiceInput': { ru: 'Голосовой ввод', en: 'Voice input', es: 'Entrada de voz', fr: 'Entrée vocale', de: 'Spracheingabe', zh: '语音输入', ja: '音声入力' },
  'chat.copy': { ru: 'Копировать', en: 'Copy', es: 'Copiar', fr: 'Copier', de: 'Kopieren', zh: '复制', ja: 'コピー' },
  
  // Examples
  'examples.title': { ru: 'Попробуйте спросить', en: 'Try asking', es: 'Prueba preguntar', fr: 'Essayez de demander', de: 'Versuchen Sie zu fragen', zh: '尝试问', ja: '質問してみてください' },
  'examples.prices': { ru: 'Что такое искусственный интеллект?', en: 'What is artificial intelligence?', es: '¿Qué es la inteligencia artificial?', fr: 'Qu\'est-ce que l\'intelligence artificielle?', de: 'Was ist künstliche Intelligenz?', zh: '什么是人工智能？', ja: 'AIとは何ですか？' },
  'examples.pricesDesc': { ru: 'Узнайте больше об AI', en: 'Learn more about AI', es: 'Aprende más sobre IA', fr: 'En savoir plus sur l\'IA', de: 'Mehr über KI erfahren', zh: '了解更多关于AI', ja: 'AIについて詳しく' },
  'examples.contacts': { ru: 'Как начать изучать программирование?', en: 'How to start learning programming?', es: '¿Cómo empezar a aprender programación?', fr: 'Comment commencer à apprendre la programmation?', de: 'Wie beginne ich mit dem Programmieren?', zh: '如何开始学习编程？', ja: 'プログラミングを始めるには？' },
  'examples.contactsDesc': { ru: 'Советы для начинающих', en: 'Tips for beginners', es: 'Consejos para principiantes', fr: 'Conseils pour débutants', de: 'Tipps für Anfänger', zh: '初学者提示', ja: '初心者向けのヒント' },
  'examples.summary': { ru: 'Расскажи интересный факт', en: 'Tell me an interesting fact', es: 'Cuéntame un hecho interesante', fr: 'Racontez-moi un fait intéressant', de: 'Erzähl mir eine interessante Tatsache', zh: '告诉我一个有趣的事实', ja: '面白い事実を教えて' },
  'examples.summaryDesc': { ru: 'Развивайте кругозор', en: 'Expand your knowledge', es: 'Amplía tus conocimientos', fr: 'Élargissez vos connaissances', de: 'Erweitern Sie Ihr Wissen', zh: '拓展知识', ja: '知識を広げる' },
  'examples.dates': { ru: 'Помоги составить план на день', en: 'Help me plan my day', es: 'Ayúdame a planificar mi día', fr: 'Aidez-moi à planifier ma journée', de: 'Hilf mir, meinen Tag zu planen', zh: '帮我计划一天', ja: '一日の計画を立てるのを手伝って' },
  'examples.datesDesc': { ru: 'Организуйте время', en: 'Organize your time', es: 'Organiza tu tiempo', fr: 'Organisez votre temps', de: 'Organisieren Sie Ihre Zeit', zh: '组织你的时间', ja: '時間を整理する' },
  
  // Settings
  'settings.title': { ru: 'Настройки', en: 'Settings', es: 'Configuración', fr: 'Paramètres', de: 'Einstellungen', zh: '设置', ja: '設定' },
  'settings.language': { ru: 'Язык интерфейса', en: 'Interface Language', es: 'Idioma de interfaz', fr: 'Langue de l\'interface', de: 'Benutzeroberflächensprache', zh: '界面语言', ja: 'インターフェース言語' },
  'settings.voiceLanguage': { ru: 'Язык озвучки', en: 'Voice Language', es: 'Idioma de voz', fr: 'Langue vocale', de: 'Sprachsprache', zh: '语音语言', ja: '音声言語' },
  'settings.theme': { ru: 'Тема', en: 'Theme', es: 'Tema', fr: 'Thème', de: 'Thema', zh: '主题', ja: 'テーマ' },
  'settings.light': { ru: 'Светлая', en: 'Light', es: 'Clara', fr: 'Claire', de: 'Hell', zh: '浅色', ja: '明るい' },
  'settings.dark': { ru: 'Темная', en: 'Dark', es: 'Oscuro', fr: 'Sombre', de: 'Dunkel', zh: '深色', ja: '暗い' },
  
  // Admin
  'admin.title': { ru: 'Админ-панель Богдана', en: 'Bogdan Admin Panel', es: 'Panel de administración', fr: 'Panneau d\'administration', de: 'Admin-Panel', zh: '管理面板', ja: '管理パネル' },
  'admin.files': { ru: 'Файлы', en: 'Files', es: 'Archivos', fr: 'Fichiers', de: 'Dateien', zh: '文件', ja: 'ファイル' },
  'admin.stats': { ru: 'Статистика', en: 'Statistics', es: 'Estadísticas', fr: 'Statistiques', de: 'Statistiken', zh: '统计', ja: '統計' },
  'admin.settings': { ru: 'Настройки', en: 'Settings', es: 'Configuración', fr: 'Paramètres', de: 'Einstellungen', zh: '设置', ja: '設定' },
  'admin.logout': { ru: 'Выйти', en: 'Logout', es: 'Cerrar sesión', fr: 'Déconnexion', de: 'Abmelden', zh: '登出', ja: 'ログアウト' },
  
  // Toasts
  'toast.saved': { ru: 'Чат сохранен', en: 'Chat saved', es: 'Chat guardado', fr: 'Chat enregistré', de: 'Chat gespeichert', zh: '聊天已保存', ja: 'チャットが保存されました' },
  'toast.deleted': { ru: 'Чат удалён', en: 'Chat deleted', es: 'Chat eliminado', fr: 'Chat supprimé', de: 'Chat gelöscht', zh: '聊天已删除', ja: 'チャットが削除されました' },
  'toast.copied': { ru: 'Скопировано', en: 'Copied', es: 'Copiado', fr: 'Copié', de: 'Kopiert', zh: '已复制', ja: 'コピーされました' },
};

interface LanguageContextType {
  language: Language;
  voiceLanguage: string;
  translateToLanguage: string;
  autoDetectLanguage: boolean;
  voiceSpeed: number;
  voiceGender: 'male' | 'female';
  favoriteVoiceName: string | null;
  setLanguage: (lang: Language) => void;
  setVoiceLanguage: (lang: string) => void;
  setTranslateToLanguage: (lang: string) => void;
  setAutoDetectLanguage: (enabled: boolean) => void;
  setVoiceSpeed: (speed: number) => void;
  setVoiceGender: (gender: 'male' | 'female') => void;
  setFavoriteVoiceName: (name: string | null) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');
  const [voiceLanguage, setVoiceLanguageState] = useState<string>('ru-RU');
  const [translateToLanguage, setTranslateToLanguageState] = useState<string>('ru');
  const [autoDetectLanguage, setAutoDetectLanguageState] = useState<boolean>(true);
  const [voiceSpeed, setVoiceSpeedState] = useState<number>(1.0);
  const [voiceGender, setVoiceGenderState] = useState<'male' | 'female'>('female');
  const [favoriteVoiceName, setFavoriteVoiceNameState] = useState<string | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    const savedVoiceLang = localStorage.getItem('voiceLanguage');
    const savedTranslateTo = localStorage.getItem('translateToLanguage');
    const savedAutoDetect = localStorage.getItem('autoDetectLanguage');
    const savedVoiceSpeed = localStorage.getItem('voiceSpeed');
    const savedVoiceGender = localStorage.getItem('voiceGender') as 'male' | 'female' | null;
    const savedFavoriteVoice = localStorage.getItem('favoriteVoiceName');
    
    if (savedLang) setLanguageState(savedLang);
    if (savedVoiceLang) setVoiceLanguageState(savedVoiceLang);
    if (savedTranslateTo) setTranslateToLanguageState(savedTranslateTo);
    if (savedAutoDetect !== null) setAutoDetectLanguageState(savedAutoDetect === 'true');
    if (savedVoiceSpeed) setVoiceSpeedState(parseFloat(savedVoiceSpeed));
    if (savedVoiceGender) setVoiceGenderState(savedVoiceGender);
    if (savedFavoriteVoice) setFavoriteVoiceNameState(savedFavoriteVoice);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setVoiceLanguage = (lang: string) => {
    setVoiceLanguageState(lang);
    localStorage.setItem('voiceLanguage', lang);
  };

  const setTranslateToLanguage = (lang: string) => {
    setTranslateToLanguageState(lang);
    localStorage.setItem('translateToLanguage', lang);
  };

  const setAutoDetectLanguage = (enabled: boolean) => {
    setAutoDetectLanguageState(enabled);
    localStorage.setItem('autoDetectLanguage', enabled.toString());
  };

  const setVoiceSpeed = (speed: number) => {
    setVoiceSpeedState(speed);
    localStorage.setItem('voiceSpeed', speed.toString());
  };

  const setVoiceGender = (gender: 'male' | 'female') => {
    setVoiceGenderState(gender);
    localStorage.setItem('voiceGender', gender);
  };

  const setFavoriteVoiceName = (name: string | null) => {
    setFavoriteVoiceNameState(name);
    if (name) {
      localStorage.setItem('favoriteVoiceName', name);
    } else {
      localStorage.removeItem('favoriteVoiceName');
    }
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      voiceLanguage, 
      translateToLanguage,
      autoDetectLanguage,
      voiceSpeed,
      voiceGender,
      favoriteVoiceName,
      setLanguage, 
      setVoiceLanguage, 
      setTranslateToLanguage,
      setAutoDetectLanguage,
      setVoiceSpeed,
      setVoiceGender,
      setFavoriteVoiceName,
      t 
    }}>
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