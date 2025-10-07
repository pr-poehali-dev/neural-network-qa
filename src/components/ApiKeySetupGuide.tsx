import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ApiKeySetupGuideProps {
  onOpenSettings: () => void;
}

export default function ApiKeySetupGuide({ onOpenSettings }: ApiKeySetupGuideProps) {
  return (
    <Card className="m-4 p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="AlertCircle" size={24} className="text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 mb-2">
            API ключ не настроен
          </h3>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Для работы чата необходимо настроить OpenRouter API ключ. Это займёт всего 2 минуты!
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Icon name="Check" size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Бесплатные модели доступны навсегда</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Icon name="Check" size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Регистрация занимает 1 минуту</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Icon name="Check" size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Без привязки карты</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onOpenSettings}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
            >
              <Icon name="Settings" className="mr-2" size={16} />
              Открыть настройки
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.open('https://openrouter.ai/keys', '_blank')}
              className="border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10"
            >
              <Icon name="ExternalLink" className="mr-2" size={16} />
              Получить ключ
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
