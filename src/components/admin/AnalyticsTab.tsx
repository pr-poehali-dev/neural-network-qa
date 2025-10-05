import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface QuestionStat {
  question: string;
  count: number;
  lastAsked: string;
}

export default function AnalyticsTab() {
  const [questionStats, setQuestionStats] = useState<QuestionStat[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [todayQuestions, setTodayQuestions] = useState(0);
  const [peakHour, setPeakHour] = useState('—');

  useEffect(() => {
    const stats = localStorage.getItem('question_stats');
    if (stats) {
      const parsed = JSON.parse(stats);
      setQuestionStats(parsed.questions || []);
      setTotalQuestions(parsed.total || 0);
      setTodayQuestions(parsed.today || 0);
      setPeakHour(parsed.peakHour || '—');
    }
  }, []);

  const topQuestions = [...questionStats]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 dark:bg-gray-800 border-indigo-200 dark:border-indigo-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Icon name="MessageSquare" className="text-white" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalQuestions}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Всего вопросов</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 dark:bg-gray-800 border-green-200 dark:border-green-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Icon name="TrendingUp" className="text-white" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{todayQuestions}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Сегодня</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 dark:bg-gray-800 border-orange-200 dark:border-orange-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Icon name="Clock" className="text-white" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{peakHour}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Пик активности</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 dark:bg-gray-800 border-purple-200 dark:border-purple-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <Icon name="BarChart" size={20} className="text-purple-600" />
          Топ-10 популярных вопросов
        </h3>
        
        {topQuestions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Статистика появится после первых вопросов пользователей
          </p>
        ) : (
          <div className="space-y-3">
            {topQuestions.map((stat, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium">{stat.question}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Задан {stat.count} раз • Последний: {new Date(stat.lastAsked).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                  <Icon name="Users" size={16} />
                  <span className="font-bold">{stat.count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 dark:bg-gray-800 border-blue-200 dark:border-blue-700">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
          <Icon name="Info" size={20} className="text-blue-600" />
          Как работает статистика
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Автоматически собирается при каждом вопросе пользователя</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Показывает популярные темы и время активности</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Помогает улучшить базу знаний и добавить быстрые кнопки</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Данные хранятся локально в браузере</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
