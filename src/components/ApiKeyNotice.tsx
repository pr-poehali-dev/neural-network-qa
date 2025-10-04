import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ApiKeyNoticeProps {
  onClose: () => void;
}

export default function ApiKeyNotice({ onClose }: ApiKeyNoticeProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up">
      <Card className="p-4 border-2 border-orange-300 bg-orange-50 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
            <Icon name="AlertTriangle" className="text-white" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-orange-900 mb-2">Демо-режим</h3>
            <p className="text-sm text-orange-800 mb-3">
              Богдан ИИ работает в демо-режиме. Для полноценной работы обновите <span className="font-mono bg-orange-200 px-1 rounded">XAI_API_KEY</span> в секретах проекта.
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="default"
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => window.open('https://docs.x.ai/api', '_blank')}
              >
                <Icon name="ExternalLink" className="mr-1" size={14} />
                Получить ключ
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                className="text-orange-900"
                onClick={onClose}
              >
                Понятно
              </Button>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-orange-600 hover:text-orange-800"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      </Card>
    </div>
  );
}
