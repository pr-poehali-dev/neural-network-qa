import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import LiveOperatorButton from '@/components/LiveOperatorButton';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatHeaderProps {
  messageCount: number;
  onExportChat: () => void;
  onClearChat: () => void;
  onOpenReadingMode?: () => void;
  onOpenLeadForm?: () => void;
  telegramBotId?: string;
}

export default function ChatHeader({
  messageCount,
  onExportChat,
  onClearChat,
  onOpenReadingMode,
  onOpenLeadForm,
  telegramBotId
}: ChatHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
          <Icon name="MessageSquare" className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('chat.title')}</h3>
          {messageCount > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {messageCount} {messageCount === 1 ? 'сообщение' : messageCount < 5 ? 'сообщения' : 'сообщений'}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <LiveOperatorButton botId={telegramBotId} />
        {onOpenLeadForm && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={onOpenLeadForm}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            <Icon name="Mail" className="mr-2" size={16} />
            Оставить заявку
          </Button>
        )}
        {messageCount > 0 && (
          <>
            {onOpenReadingMode && (
              <Button variant="outline" size="sm" onClick={onOpenReadingMode} className="dark:border-purple-800">
                <Icon name="BookOpen" className="mr-2" size={16} />
                Чтение
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onExportChat} className="dark:border-purple-800">
              <Icon name="Download" className="mr-2" size={16} />
              {t('chat.export')}
            </Button>
            <Button variant="outline" size="sm" onClick={onClearChat} className="dark:border-purple-800">
              <Icon name="Plus" className="mr-2" size={16} />
              {t('chat.new')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}