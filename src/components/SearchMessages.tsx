import { useState } from 'react';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface SearchMessagesProps {
  messages: Array<{ role: string; text: string }>;
  onResultClick: (index: number) => void;
}

export default function SearchMessages({ messages, onResultClick }: SearchMessagesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<number[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const matchingIndices = messages
      .map((msg, index) => ({ msg, index }))
      .filter(({ msg }) => msg.text.toLowerCase().includes(query.toLowerCase()))
      .map(({ index }) => index);

    setResults(matchingIndices);
  };

  return (
    <div className="mb-4">
      <div className="relative">
        <Icon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={18} 
        />
        <Input
          type="text"
          placeholder="Поиск по сообщениям..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 border-purple-200 dark:border-purple-800 dark:bg-gray-800"
        />
      </div>
      
      {searchQuery && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {results.length > 0 ? (
            <span>Найдено: {results.length} {results.length === 1 ? 'совпадение' : results.length < 5 ? 'совпадения' : 'совпадений'}</span>
          ) : (
            <span>Ничего не найдено</span>
          )}
        </div>
      )}
    </div>
  );
}
