import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface ChatHistoryItem {
  id: number;
  title: string;
  created_at: string;
  messages: Array<{ role: string; text: string }>;
  tags?: string[];
}

interface ChatHistoryPanelProps {
  chatHistory: ChatHistoryItem[];
  onClose: () => void;
  onLoadChat: (chat: ChatHistoryItem) => void;
  onDeleteChat: (chatId: number) => void;
  onUpdateTags?: (chatId: number, tags: string[]) => void;
}

const TAG_OPTIONS = [
  { name: 'Учёба', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { name: 'Работа', color: 'bg-green-100 text-green-700 border-green-300' },
  { name: 'Творчество', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { name: 'Код', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { name: 'Идеи', color: 'bg-pink-100 text-pink-700 border-pink-300' },
  { name: 'Личное', color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
];

export default function ChatHistoryPanel({ 
  chatHistory, 
  onClose, 
  onLoadChat, 
  onDeleteChat,
  onUpdateTags
}: ChatHistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<number | null>(null);

  const filteredChats = chatHistory.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || chat.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const getTagColor = (tagName: string) => {
    return TAG_OPTIONS.find(t => t.name === tagName)?.color || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const toggleTag = (chatId: number, tagName: string) => {
    if (!onUpdateTags) return;
    
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;
    
    const currentTags = chat.tags || [];
    const newTags = currentTags.includes(tagName)
      ? currentTags.filter(t => t !== tagName)
      : [...currentTags, tagName];
    
    onUpdateTags(chatId, newTags);
  };

  return (
    <Card className="absolute left-0 top-0 w-80 max-h-[600px] overflow-y-auto border-2 border-purple-200 p-4 z-20 shadow-xl bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-900">История чатов</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <Icon name="X" size={16} />
        </Button>
      </div>

      <div className="mb-4 space-y-3">
        <div className="relative">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Поиск по чатам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-purple-200"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-xs px-2 py-1 rounded-full border transition-all ${
              !selectedTag 
                ? 'bg-indigo-100 text-indigo-700 border-indigo-300' 
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            Все
          </button>
          {TAG_OPTIONS.map(tag => (
            <button
              key={tag.name}
              onClick={() => setSelectedTag(tag.name)}
              className={`text-xs px-2 py-1 rounded-full border transition-all ${
                selectedTag === tag.name ? tag.color : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
      
      {filteredChats.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          {searchQuery || selectedTag ? 'Ничего не найдено' : 'Нет сохранённых чатов'}
        </p>
      ) : (
        <div className="space-y-2">
          {filteredChats.map((chat) => (
            <div 
              key={chat.id}
              className="p-3 rounded-lg border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
            >
              <div onClick={() => onLoadChat(chat)} className="cursor-pointer">
                <p className="font-medium text-sm text-gray-900 truncate">{chat.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {chat.messages.length} сообщений
                </p>
                
                {chat.tags && chat.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {chat.tags.map(tag => (
                      <span key={tag} className={`text-xs px-2 py-0.5 rounded-full border ${getTagColor(tag)}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-2 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingChatId === chat.id ? (
                  <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded">
                    {TAG_OPTIONS.map(tag => (
                      <button
                        key={tag.name}
                        onClick={() => toggleTag(chat.id, tag.name)}
                        className={`text-xs px-2 py-1 rounded-full border transition-all ${
                          chat.tags?.includes(tag.name) ? tag.color : 'bg-white border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                    <button
                      onClick={() => setEditingChatId(null)}
                      className="text-xs px-2 py-1 bg-gray-200 rounded-full ml-auto"
                    >
                      Готово
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 text-xs text-indigo-600 hover:text-indigo-700"
                      onClick={(e) => { e.stopPropagation(); setEditingChatId(chat.id); }}
                    >
                      <Icon name="Tag" size={12} className="mr-1" />
                      Теги
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 text-xs text-red-500 hover:text-red-700"
                      onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                    >
                      <Icon name="Trash2" size={12} className="mr-1" />
                      Удалить
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
