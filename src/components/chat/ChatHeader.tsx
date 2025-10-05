import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatHeaderProps {
  messageCount: number;
  onExportChat: () => void;
  onClearChat: () => void;
}

export default function ChatHeader({
  messageCount,
  onExportChat,
  onClearChat
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
        {messageCount > 0 && (
          <>
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
