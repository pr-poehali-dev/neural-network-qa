import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface LeadFormProps {
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; phone: string; message: string }) => void;
}

export default function LeadForm({ onClose, onSubmit }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({ 
        title: 'Заполните обязательные поля',
        description: 'Имя и Email обязательны',
        variant: 'destructive' 
      });
      return;
    }

    setIsSubmitting(true);

    const adminEmail = localStorage.getItem('admin_email') || 'admin@example.com';
    const emailBody = `
Новая заявка с сайта

Имя: ${formData.name}
Email: ${formData.email}
Телефон: ${formData.phone || 'Не указан'}
Сообщение: ${formData.message || 'Нет сообщения'}
    `.trim();

    const mailtoLink = `mailto:${adminEmail}?subject=Заявка от ${formData.name}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoLink;

    setTimeout(() => {
      onSubmit(formData);
      toast({ title: 'Заявка готова к отправке', description: 'Откроется почтовое приложение' });
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white dark:bg-gray-800 p-6 max-w-md w-full animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="Mail" size={24} className="text-purple-600" />
            Оставить заявку
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Имя <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Ваше имя"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="dark:bg-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="dark:bg-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Телефон
            </label>
            <Input
              type="tel"
              placeholder="+7 999 123-45-67"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Сообщение
            </label>
            <Textarea
              placeholder="Ваш вопрос или комментарий..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="dark:bg-gray-900 dark:text-white resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Icon name="Loader2" className="animate-spin mr-2" size={18} />
              ) : (
                <Icon name="Send" className="mr-2" size={18} />
              )}
              Отправить заявку
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Откроется ваше почтовое приложение для отправки
        </p>
      </Card>
    </div>
  );
}
