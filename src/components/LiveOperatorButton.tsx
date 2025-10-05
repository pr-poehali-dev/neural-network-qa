import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface LiveOperatorButtonProps {
  botId?: string;
  className?: string;
}

export default function LiveOperatorButton({ botId, className = '' }: LiveOperatorButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSendToOperator = () => {
    if (!message.trim()) {
      toast({ 
        title: 'Введите сообщение',
        variant: 'destructive' 
      });
      return;
    }

    if (!botId) {
      toast({
        title: 'Telegram бот не настроен',
        description: 'Настройте Telegram бот ID в админ-панели',
        variant: 'destructive'
      });
      setShowForm(false);
      return;
    }

    const operatorMessage = `
🔔 *Новое обращение к живому оператору*

📝 *Сообщение:*
${message}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}
📍 *Страница:* ${window.location.href}
    `.trim();

    const telegramUrl = `https://api.telegram.org/bot${botId}/sendMessage`;
    const adminChatId = localStorage.getItem('telegram_admin_chat_id');

    if (!adminChatId) {
      const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(operatorMessage)}`;
      window.open(telegramLink, '_blank');
      toast({
        title: 'Открыт Telegram',
        description: 'Отправьте сообщение оператору'
      });
      setShowForm(false);
      setMessage('');
      return;
    }

    fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: adminChatId,
        text: operatorMessage,
        parse_mode: 'Markdown'
      })
    })
      .then(() => {
        toast({
          title: 'Сообщение отправлено!',
          description: 'Оператор свяжется с вами в ближайшее время'
        });
        setShowForm(false);
        setMessage('');
      })
      .catch(() => {
        toast({
          title: 'Ошибка отправки',
          description: 'Попробуйте позже',
          variant: 'destructive'
        });
      });
  };

  if (showForm) {
    return (
      <Card className="fixed bottom-6 right-6 z-50 p-4 bg-white dark:bg-gray-800 shadow-xl max-w-sm animate-scale-in">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="Users" size={20} className="text-blue-600" />
            Связь с оператором
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
            <Icon name="X" size={18} />
          </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Опишите ваш вопрос, оператор ответит в Telegram
        </p>
        <Textarea
          placeholder="Ваш вопрос..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mb-3 dark:bg-gray-900 dark:text-white"
          rows={4}
        />
        <Button 
          onClick={handleSendToOperator}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Icon name="Send" size={16} className="mr-2" />
          Отправить оператору
        </Button>
      </Card>
    );
  }

  return (
    <Button
      onClick={() => setShowForm(true)}
      size="sm"
      variant="outline"
      className={`border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 ${className}`}
    >
      <Icon name="Users" size={16} className="mr-2" />
      Связаться с оператором
    </Button>
  );
}
