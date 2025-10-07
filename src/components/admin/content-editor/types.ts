export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    ctaButton: string;
  };
  features: {
    title: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  about: {
    title: string;
    description: string;
    team: Array<{
      name: string;
      role: string;
      description: string;
      email: string;
      telegram: string;
      whatsapp: string;
    }>;
  };
  footer: {
    companyName: string;
    tagline: string;
    sections: Array<{
      title: string;
      links: Array<{
        label: string;
        href: string;
      }>;
    }>;
  };
}

export function getDefaultContent(): SiteContent {
  return {
    hero: {
      title: 'Богдан ИИ',
      subtitle: 'Умный помощник нового поколения',
      ctaButton: 'Начать общение'
    },
    features: {
      title: 'Наши возможности',
      items: [
        {
          icon: 'MessageSquare',
          title: 'Диалоги',
          description: 'Естественное общение на русском языке'
        },
        {
          icon: 'Image',
          title: 'Работа с изображениями',
          description: 'Анализ и обработка фото'
        },
        {
          icon: 'Code',
          title: 'Генерация кода',
          description: 'Помощь в программировании'
        },
        {
          icon: 'Globe',
          title: 'Переводы',
          description: '100+ языков мира'
        }
      ]
    },
    about: {
      title: 'О нас',
      description: 'Мы создаем будущее взаимодействия с искусственным интеллектом',
      team: [
        {
          name: 'Богдан Копаев',
          role: 'Создатель проекта',
          description: 'Основатель проекта Богдан ИИ',
          email: 'bogdan@bogdan-ai.com',
          telegram: 'https://t.me/bogdankop',
          whatsapp: 'https://wa.me/79111234567'
        }
      ]
    },
    footer: {
      companyName: 'Богдан ИИ',
      tagline: 'Умный помощник нового поколения',
      sections: [
        {
          title: 'Компания',
          links: [
            { label: 'О нас', href: '/about' },
            { label: 'Связаться', href: '/contact' }
          ]
        },
        {
          title: 'Документы',
          links: [
            { label: 'Политика конфиденциальности', href: '/privacy' },
            { label: 'Условия использования', href: '/terms' }
          ]
        }
      ]
    }
  };
}
