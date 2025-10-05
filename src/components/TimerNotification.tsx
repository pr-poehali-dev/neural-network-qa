import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Timer {
  id: string;
  duration: number;
  remaining: number;
  message: string;
}

interface Reminder {
  id: string;
  time: Date;
  message: string;
  completed: boolean;
}

export default function TimerNotification() {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const updated = prev.map(timer => ({
          ...timer,
          remaining: Math.max(0, timer.remaining - 1)
        }));

        updated.forEach(timer => {
          if (timer.remaining === 0) {
            playNotification();
            showNotification('⏰ Таймер завершён!', timer.message);
          }
        });

        return updated.filter(t => t.remaining > 0);
      });

      setReminders(prev => {
        const now = new Date();
        prev.forEach(reminder => {
          if (!reminder.completed && reminder.time <= now) {
            playNotification();
            showNotification('🔔 Напоминание', reminder.message);
            reminder.completed = true;
          }
        });
        return [...prev];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const playNotification = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77eeeTRALUKfk77RgGwU7k9jyyXoqBS19z/DdkzkCEWS87OiiUxQIQ5zd8sFuJAYnf8rx3I5ACA==');
    audio.play().catch(() => {});
  };

  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  const addTimer = (minutes: number, message: string = 'Время вышло!') => {
    const timer: Timer = {
      id: Date.now().toString(),
      duration: minutes * 60,
      remaining: minutes * 60,
      message
    };
    setTimers(prev => [...prev, timer]);
    setShowPanel(true);
  };

  const addReminder = (minutes: number, message: string = 'Напоминание') => {
    const reminder: Reminder = {
      id: Date.now().toString(),
      time: new Date(Date.now() + minutes * 60 * 1000),
      message,
      completed: false
    };
    setReminders(prev => [...prev, reminder]);
    setShowPanel(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowPanel(!showPanel)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg relative"
        >
          <Icon name="Clock" size={24} />
          {(timers.length > 0 || reminders.filter(r => !r.completed).length > 0) && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              {timers.length + reminders.filter(r => !r.completed).length}
            </span>
          )}
        </Button>
      </div>

      {showPanel && (
        <div className="fixed bottom-24 right-6 z-50 w-80 animate-slide-up">
          <Card className="p-4 dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">⏰ Таймеры и Напоминания</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPanel(false)}>
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addTimer(5, '5 минут истекло!')}
                  className="border-purple-200 dark:border-purple-700"
                >
                  <Icon name="Timer" className="mr-1" size={14} />
                  5 мин
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addTimer(10, '10 минут истекло!')}
                  className="border-purple-200 dark:border-purple-700"
                >
                  <Icon name="Timer" className="mr-1" size={14} />
                  10 мин
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addTimer(30, '30 минут истекло!')}
                  className="border-purple-200 dark:border-purple-700"
                >
                  <Icon name="Timer" className="mr-1" size={14} />
                  30 мин
                </Button>
              </div>

              {timers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Активные таймеры:</p>
                  {timers.map(timer => (
                    <div key={timer.id} className="flex items-center justify-between bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatTime(timer.remaining)}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{timer.message}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTimers(prev => prev.filter(t => t.id !== timer.id))}
                      >
                        <Icon name="X" size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {reminders.filter(r => !r.completed).length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Напоминания:</p>
                  {reminders.filter(r => !r.completed).map(reminder => (
                    <div key={reminder.id} className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {reminder.time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{reminder.message}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReminders(prev => prev.filter(r => r.id !== reminder.id))}
                      >
                        <Icon name="X" size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {timers.length === 0 && reminders.filter(r => !r.completed).length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Нет активных таймеров
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
