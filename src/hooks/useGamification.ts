import { useState, useEffect } from 'react';

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
  { level: 1, minPoints: 0 },
  { level: 2, minPoints: 50 },
  { level: 3, minPoints: 150 },
  { level: 4, minPoints: 300 },
  { level: 5, minPoints: 500 },
  { level: 6, minPoints: 800 },
  { level: 7, minPoints: 1200 },
  { level: 8, minPoints: 2000 },
];

export function useGamification() {
  const [data, setData] = useState<GamificationData>({
    points: 0,
    level: 1,
    questionsAsked: 0,
    messagesReceived: 0,
    streak: 0,
    lastActivity: new Date().toISOString(),
    achievements: []
  });

  useEffect(() => {
    const savedData = localStorage.getItem('gamification_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setData(parsed);
      
      const lastDate = new Date(parsed.lastActivity).toDateString();
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastDate === yesterday) {
      } else if (lastDate !== today) {
        parsed.streak = 0;
        saveData(parsed);
      }
    }
  }, []);

  const saveData = (newData: GamificationData) => {
    localStorage.setItem('gamification_data', JSON.stringify(newData));
    setData(newData);
  };

  const calculateLevel = (points: number): number => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].minPoints) {
        return LEVELS[i].level;
      }
    }
    return 1;
  };

  const addPoints = (points: number, reason?: string) => {
    const newData = { ...data };
    newData.points += points;
    newData.level = calculateLevel(newData.points);
    
    if (reason) {
      console.log(`🎮 +${points} баллов: ${reason}`);
    }
    
    saveData(newData);
    return newData;
  };

  const unlockAchievement = (achievementId: string, points: number) => {
    if (data.achievements.includes(achievementId)) {
      return data;
    }
    
    const newData = { ...data };
    newData.achievements.push(achievementId);
    newData.points += points;
    newData.level = calculateLevel(newData.points);
    
    console.log(`🏆 Достижение разблокировано: ${achievementId} (+${points} баллов)`);
    
    saveData(newData);
    return newData;
  };

  const trackQuestion = () => {
    const newData = { ...data };
    newData.questionsAsked += 1;
    newData.points += 5;
    newData.level = calculateLevel(newData.points);
    
    const lastDate = new Date(data.lastActivity).toDateString();
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastDate === yesterday) {
        newData.streak += 1;
      } else {
        newData.streak = 1;
      }
    }
    
    newData.lastActivity = new Date().toISOString();
    
    if (newData.questionsAsked === 1 && !newData.achievements.includes('first_question')) {
      newData.achievements.push('first_question');
      newData.points += 10;
    }
    
    if (newData.questionsAsked === 5 && !newData.achievements.includes('curious_5')) {
      newData.achievements.push('curious_5');
      newData.points += 20;
    }
    
    if (newData.questionsAsked === 10 && !newData.achievements.includes('active_10')) {
      newData.achievements.push('active_10');
      newData.points += 30;
    }
    
    if (newData.questionsAsked === 25 && !newData.achievements.includes('chatter_25')) {
      newData.achievements.push('chatter_25');
      newData.points += 50;
    }
    
    if (newData.questionsAsked === 50 && !newData.achievements.includes('expert_50')) {
      newData.achievements.push('expert_50');
      newData.points += 100;
    }
    
    if (newData.streak === 3 && !newData.achievements.includes('streak_3')) {
      newData.achievements.push('streak_3');
      newData.points += 30;
    }
    
    if (newData.streak === 7 && !newData.achievements.includes('streak_7')) {
      newData.achievements.push('streak_7');
      newData.points += 70;
    }
    
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6 && !newData.achievements.includes('early_bird')) {
      newData.achievements.push('early_bird');
      newData.points += 15;
    }
    
    if (hour >= 23 || hour < 1 && !newData.achievements.includes('night_owl')) {
      newData.achievements.push('night_owl');
      newData.points += 15;
    }
    
    newData.level = calculateLevel(newData.points);
    
    saveData(newData);
    return newData;
  };

  const trackAnswer = () => {
    const newData = { ...data };
    newData.messagesReceived += 1;
    newData.points += 2;
    newData.level = calculateLevel(newData.points);
    
    saveData(newData);
    return newData;
  };

  const trackVoiceUsage = () => {
    if (!data.achievements.includes('voice_user')) {
      unlockAchievement('voice_user', 25);
    }
  };

  return {
    data,
    addPoints,
    unlockAchievement,
    trackQuestion,
    trackAnswer,
    trackVoiceUsage
  };
}
