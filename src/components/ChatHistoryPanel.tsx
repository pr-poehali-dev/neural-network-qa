import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ChatHistoryItem {
  id: number;
  title: string;
  created_at: string;
  messages: Array<{ role: string; text: string }>;
}

interface ChatHistoryPanelProps {
  chatHistory: ChatHistoryItem[];
  onClose: () => void;
  onLoadChat: (chat: ChatHistoryItem) => void;
  onDeleteChat: (chatId: number) => void;
}

export default function ChatHistoryPanel({ 
  chatHistory, 
  onClose, 
  onLoadChat, 
  onDeleteChat 
}: ChatHistoryPanelProps) {
  return (
    <Card className="absolute left-0 top-0 w-80 max-h-[600px] overflow-y-auto border-2 border-purple-200 p-4 z-20 shadow-xl bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-900">История чатов</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <Icon name="X" size={16} />
        </Button>
      </div>
      
      {chatHistory.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">Нет сохранённых чатов</p>
      ) : (
        <div className="space-y-2">
          {chatHistory.map((chat) => (
            <div 
              key={chat.id}
              className="p-3 rounded-lg border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group"
            >
              <div onClick={() => onLoadChat(chat)}>
                <p className="font-medium text-sm text-gray-900 truncate">{chat.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {chat.messages.length} сообщений
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-red-500 hover:text-red-700 w-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
              >
                <Icon name="Trash2" size={14} className="mr-1" />
                Удалить
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
