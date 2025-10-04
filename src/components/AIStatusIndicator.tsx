import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

export default function AIStatusIndicator() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/95328c78-94a6-4f98-a89c-a4b1b840ea99', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'test' })
      });

      const data = await response.json();
      
      if (response.ok && data.response) {
        setStatus('online');
      } else if (data.error) {
        setStatus('offline');
        setError(data.error);
      } else {
        setStatus('offline');
        setError(`Ошибка ${response.status}`);
      }
    } catch (err) {
      setStatus('offline');
      setError('Нет соединения');
    }
  };

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
        <span className="text-xs text-gray-600">Проверка...</span>
      </div>
    );
  }

  if (status === 'offline') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <span className="text-xs text-red-700">Офлайн</span>
        {error && (
          <button 
            className="text-red-600 hover:text-red-800"
            title={error}
          >
            <Icon name="Info" size={14} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      <span className="text-xs text-green-700">Grok AI онлайн</span>
    </div>
  );
}