import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface WelcomeFormProps {
  onComplete: (name: string) => void;
}

export default function WelcomeForm({ onComplete }: WelcomeFormProps) {
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      onComplete(savedName);
    }
  }, [onComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('userName', name.trim());
      const userData = {
        name: name.trim(),
        email: '',
        phone: '',
        company: '',
        avatar: '👤',
        registeredAt: new Date().toISOString(),
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      onComplete(name.trim());
    }
  };

  const questions = [
    { emoji: '👋', text: 'Добро пожаловать!' },
    { emoji: '🤝', text: 'Давайте познакомимся!' },
    { emoji: '✨', text: 'Как я могу к вам обращаться?' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => (prev < 2 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      <Card className="w-full max-w-md p-8 border-2 border-purple-200 dark:border-purple-800 dark:bg-gray-900">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">
            {questions[step].emoji}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {questions[step].text}
          </h2>
          {step === 2 && (
            <p className="text-gray-600 dark:text-gray-400">
              Это поможет нам сделать общение более персональным
            </p>
          )}
        </div>

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите ваше имя"
                className="text-lg"
                autoFocus
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-lg py-6"
              disabled={!name.trim()}
            >
              <Icon name="ArrowRight" size={24} className="mr-2" />
              Начать общение
            </Button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}
