import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GamificationData {
  points: number;
  level: number;
  questionsAsked: number;
  messagesReceived: number;
  streak: number;
  lastActivity: string;
  achievements: string[];
}

const LEVELS = [
  { level: 1, name: 'Новичок', minPoints: 0, emoji: '🌱', reward: null },
  { level: 2, name: 'Любознательный', minPoints: 50, emoji: '🔍', reward: 'Доступ к истории чатов' },
  { level: 3, name: 'Исследователь', minPoints: 150, emoji: '🎒', reward: 'Экспорт чатов в файл' },
  { level: 4, name: 'Знаток', minPoints: 300, emoji: '📚', reward: 'Приоритет в очереди ответов' },
  { level: 5, name: 'Мастер', minPoints: 500, emoji: '⭐', reward: 'Доступ к расширенным подсказкам' },
  { level: 6, name: 'Эксперт', minPoints: 800, emoji: '🏆', reward: 'Персональные настройки AI' },
  { level: 7, name: 'Гуру', minPoints: 1200, emoji: '💎', reward: 'Эксклюзивные быстрые кнопки' },
  { level: 8, name: 'Легенда', minPoints: 2000, emoji: '👑', reward: 'Ранний доступ к новым функциям' },
];

const ACHIEVEMENTS = [
  { id: 'first_question', name: 'Первый вопрос', emoji: '🎯', description: 'Задайте первый вопрос', points: 10 },
  { id: 'curious_5', name: 'Любопытный', emoji: '🤔', description: 'Задайте 5 вопросов', points: 20 },
  { id: 'active_10', name: 'Активный', emoji: '⚡', description: 'Задайте 10 вопросов', points: 30 },
  { id: 'chatter_25', name: 'Болтун', emoji: '💬', description: 'Задайте 25 вопросов', points: 50 },
  { id: 'expert_50', name: 'Эксперт общения', emoji: '🎓', description: 'Задайте 50 вопросов', points: 100 },
  { id: 'streak_3', name: 'Постоянство', emoji: '🔥', description: '3 дня подряд', points: 30 },
  { id: 'streak_7', name: 'Преданный', emoji: '💪', description: '7 дней подряд', points: 70 },
  { id: 'night_owl', name: 'Ночная сова', emoji: '🦉', description: 'Вопрос после полуночи', points: 15 },
  { id: 'early_bird', name: 'Ранняя пташка', emoji: '🐦', description: 'Вопрос до 6 утра', points: 15 },
  { id: 'voice_user', name: 'Голосовой ас', emoji: '🎤', description: 'Используйте голосовой ввод', points: 25 },
];

interface GamificationProps {
  onClose: () => void;
}

export default function Gamification({ onClose }: GamificationProps) {
  const [data, setData] = useState<GamificationData>({
    points: 0,
    level: 1,
    questionsAsked: 0,
    messagesReceived: 0,
    streak: 0,
    lastActivity: new Date().toISOString(),
    achievements: []
  });

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('gamification_data');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  const saveData = (newData: GamificationData) => {
    localStorage.setItem('gamification_data', JSON.stringify(newData));
    setData(newData);
  };

  const currentLevel = LEVELS.find(l => l.level === data.level) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === data.level + 1);
  const progressToNextLevel = nextLevel 
    ? ((data.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  const unlockedAchievements = ACHIEVEMENTS.filter(a => data.achievements.includes(a.id));
  const lockedAchievements = ACHIEVEMENTS.filter(a => !data.achievements.includes(a.id));

  const resetProgress = () => {
    if (confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
      const freshData: GamificationData = {
        points: 0,
        level: 1,
        questionsAsked: 0,
        messagesReceived: 0,
        streak: 0,
        lastActivity: new Date().toISOString(),
        achievements: []
      };
      saveData(freshData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-900 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🎮 Ваш прогресс
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <Icon name="X" size={24} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Уровень</p>
                <p className="text-3xl font-bold">{data.level}</p>
                <p className="text-sm mt-1">{currentLevel.emoji} {currentLevel.name}</p>
              </div>
              <div className="text-5xl">{currentLevel.emoji}</div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Баллы</p>
                <p className="text-3xl font-bold">{data.points}</p>
                {nextLevel && (
                  <p className="text-sm mt-1">До {nextLevel.level} ур: {nextLevel.minPoints - data.points}</p>
                )}
              </div>
              <div className="text-5xl">💎</div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Серия дней</p>
                <p className="text-3xl font-bold">{data.streak}</p>
                <p className="text-sm mt-1">🔥 Продолжайте!</p>
              </div>
              <div className="text-5xl">🔥</div>
            </div>
          </Card>
        </div>

        {nextLevel && (
          <Card className="p-4 mb-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Прогресс до уровня {nextLevel.level}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(progressToNextLevel)}%
              </p>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
              />
            </div>
            {nextLevel.reward && (
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                🎁 Награда: {nextLevel.reward}
              </p>
            )}
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-3 text-center dark:bg-gray-800">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{data.questionsAsked}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Вопросов задано</p>
          </Card>
          <Card className="p-3 text-center dark:bg-gray-800">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.messagesReceived}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Ответов получено</p>
          </Card>
          <Card className="p-3 text-center dark:bg-gray-800">
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{unlockedAchievements.length}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Достижений</p>
          </Card>
          <Card className="p-3 text-center dark:bg-gray-800">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.streak}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Дней подряд</p>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
            🏆 Достижения ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
          </h3>
          
          {unlockedAchievements.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">✅ Получено</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {unlockedAchievements.map(achievement => (
                  <Card key={achievement.id} className="p-3 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{achievement.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{achievement.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                      </div>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">+{achievement.points}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {lockedAchievements.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">🔒 Доступные</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {lockedAchievements.map(achievement => (
                  <Card key={achievement.id} className="p-3 bg-gray-50 dark:bg-gray-800 opacity-60">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl grayscale">{achievement.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{achievement.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-400">+{achievement.points}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">📊 Все уровни</h3>
          <div className="space-y-2">
            {LEVELS.map(level => (
              <Card 
                key={level.level} 
                className={`p-3 ${data.level >= level.level ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800' : 'bg-gray-50 dark:bg-gray-800 opacity-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{level.emoji}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">
                        Уровень {level.level}: {level.name}
                        {data.level === level.level && <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">Текущий</span>}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {level.minPoints} баллов {level.reward && `• ${level.reward}`}
                      </p>
                    </div>
                  </div>
                  {data.level >= level.level && <Icon name="CheckCircle2" className="text-green-500" size={20} />}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            Закрыть
          </Button>
          <Button 
            onClick={resetProgress}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Icon name="RotateCcw" className="mr-2" size={16} />
            Сбросить
          </Button>
        </div>
      </Card>
    </div>
  );
}