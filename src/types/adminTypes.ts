export const FILE_UPLOAD_URL = 'https://functions.poehali.dev/b58abb29-2429-4b6e-aed0-e5aae54d2240';

export const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export interface SiteSettings {
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
  geminiApiKey?: string;
  aiModel?: string;
  enableAiChat?: boolean;
}

export interface UploadedFile {
  id?: number;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  isImage?: boolean;
  base64?: string;
  mimeType?: string;
  description?: string;
}

export interface CustomPage {
  id: string;
  title: string;
  content: string;
}

export type AdminTabType = 'dashboard' | 'site' | 'files' | 'stats' | 'content' | 'buttons' | 'analytics' | 'voice' | 'control' | 'visual' | 'security' | 'languages';