export interface ModelCapabilities {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: {
    text: boolean;
    images: boolean;
    files: boolean;
    voice: boolean;
    code: boolean;
    translation: boolean;
  };
  limits: {
    contextWindow: string;
    speed: 'fast' | 'medium' | 'slow';
  };
}

export const MODEL_CAPABILITIES: Record<string, ModelCapabilities> = {
  'google/gemini-2.0-flash-exp:free': {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash',
    icon: '⭐',
    description: 'Быстрая универсальная модель с поддержкой изображений',
    features: {
      text: true,
      images: true,
      files: true,
      voice: false,
      code: true,
      translation: true,
    },
    limits: {
      contextWindow: '1M токенов',
      speed: 'fast',
    },
  },
  'sberbank/gigachat:latest': {
    id: 'sberbank/gigachat:latest',
    name: 'GigaChat',
    icon: '🇷🇺',
    description: 'Российская модель от Сбербанка с глубоким пониманием русского языка',
    features: {
      text: true,
      images: false,
      files: true,
      voice: false,
      code: true,
      translation: true,
    },
    limits: {
      contextWindow: '8K токенов',
      speed: 'medium',
    },
  },
  'meta-llama/llama-3.3-70b-instruct:free': {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B',
    icon: '🔥',
    description: 'Мощная модель для сложных текстовых задач',
    features: {
      text: true,
      images: false,
      files: true,
      voice: false,
      code: true,
      translation: true,
    },
    limits: {
      contextWindow: '128K токенов',
      speed: 'medium',
    },
  },
  'meta-llama/llama-3.1-8b-instruct:free': {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B',
    icon: '⚡',
    description: 'Быстрая и лёгкая модель для простых задач',
    features: {
      text: true,
      images: false,
      files: true,
      voice: false,
      code: true,
      translation: true,
    },
    limits: {
      contextWindow: '128K токенов',
      speed: 'fast',
    },
  },
  'meta-llama/llama-3.1-70b-instruct:free': {
    id: 'meta-llama/llama-3.1-70b-instruct:free',
    name: 'Llama 3.1 70B',
    icon: '🦙',
    description: 'Предыдущая версия Llama 70B',
    features: {
      text: true,
      images: false,
      files: true,
      voice: false,
      code: true,
      translation: true,
    },
    limits: {
      contextWindow: '128K токенов',
      speed: 'medium',
    },
  },
  'microsoft/phi-3-medium-128k-instruct:free': {
    id: 'microsoft/phi-3-medium-128k-instruct:free',
    name: 'Phi-3 Medium',
    icon: '💼',
    description: 'Компактная модель с большим контекстным окном',
    features: {
      text: true,
      images: false,
      files: true,
      voice: false,
      code: true,
      translation: true,
    },
    limits: {
      contextWindow: '128K токенов',
      speed: 'fast',
    },
  },
};

export function getModelCapabilities(modelId: string): ModelCapabilities {
  return MODEL_CAPABILITIES[modelId] || MODEL_CAPABILITIES['google/gemini-2.0-flash-exp:free'];
}

export function supportsImages(modelId: string): boolean {
  return getModelCapabilities(modelId).features.images;
}

export function supportsFiles(modelId: string): boolean {
  return getModelCapabilities(modelId).features.files;
}