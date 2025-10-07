import Icon from '@/components/ui/icon';

interface AIChatStatsProps {
  totalTokens: number;
  messageCount: number;
}

export default function AIChatStats({ totalTokens, messageCount }: AIChatStatsProps) {
  if (totalTokens === 0) return null;

  return (
    <div className="px-4 py-2 bg-blue-50 dark:bg-gray-900 border-b dark:border-gray-700">
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <Icon name="Zap" size={12} />
          Токенов: {totalTokens}
        </span>
        <span className="flex items-center gap-1">
          <Icon name="MessageSquare" size={12} />
          Сообщений: {messageCount}
        </span>
      </div>
    </div>
  );
}
