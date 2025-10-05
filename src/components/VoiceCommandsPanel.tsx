import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function VoiceCommandsPanel() {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [response, setResponse] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    const savedNotes = localStorage.getItem('voice_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const executeCommand = (transcript: string) => {
    const lower = transcript.toLowerCase();
    
    if (lower.includes('время') || lower.includes('сколько времени')) {
      const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      setResponse(`⏰ Сейчас ${time}`);
      speak(`Сейчас ${time}`);
      return;
    }
    
    if (lower.includes('дата') || lower.includes('какое число') || lower.includes('какой день')) {
      const date = new Date().toLocaleDateString('ru-RU', { 
        weekday: 'long',
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      setResponse(`📅 Сегодня ${date}`);
      speak(`Сегодня ${date}`);
      return;
    }
    
    if (lower.includes('посчитай') || lower.includes('вычисли') || lower.includes('сколько будет')) {
      const mathExpression = lower
        .replace(/посчитай|вычисли|сколько будет/gi, '')
        .trim();
      try {
        const result = evaluateMath(mathExpression);
        setResponse(`🔢 ${mathExpression} = ${result}`);
        speak(`Результат: ${result}`);
        return;
      } catch (e) {
        setResponse(`❌ Не могу вычислить "${mathExpression}"`);
        speak('Не могу вычислить');
        return;
      }
    }
    
    if (lower.includes('запомни')) {
      const note = transcript.replace(/запомни/gi, '').trim();
      if (note) {
        const newNotes = [...notes, note];
        setNotes(newNotes);
        localStorage.setItem('voice_notes', JSON.stringify(newNotes));
        setResponse(`💾 Запомнил: "${note}"`);
        speak('Запомнил');
        return;
      }
    }
    
    if (lower.includes('что ты запомнил') || lower.includes('мои заметки') || lower.includes('покажи заметки')) {
      if (notes.length === 0) {
        setResponse('📝 Заметок пока нет');
        speak('У меня нет заметок');
      } else {
        setResponse(`📝 Ваши заметки (${notes.length}):\n\n${notes.map((n, i) => `${i + 1}. ${n}`).join('\n')}`);
        speak(`У вас ${notes.length} ${notes.length === 1 ? 'заметка' : notes.length < 5 ? 'заметки' : 'заметок'}`);
      }
      return;
    }
    
    if (lower.includes('очисти заметки') || lower.includes('удали заметки') || lower.includes('очистить заметки')) {
      setNotes([]);
      localStorage.removeItem('voice_notes');
      setResponse('🗑️ Все заметки очищены');
      speak('Заметки очищены');
      return;
    }

    if (lower.includes('привет') || lower.includes('здравствуй')) {
      setResponse('👋 Привет! Я готов помочь');
      speak('Привет! Я готов помочь');
      return;
    }

    setResponse(`❓ Команда не распознана: "${transcript}"\n\nПопробуйте: время, дата, посчитай, запомни`);
    speak('Команда не распознана');
  };

  const evaluateMath = (expr: string): number => {
    const russianToEnglish: Record<string, string> = {
      'плюс': '+',
      'минус': '-',
      'умножить на': '*',
      'умножить': '*',
      'разделить на': '/',
      'разделить': '/',
      'ноль': '0',
      'один': '1',
      'два': '2',
      'три': '3',
      'четыре': '4',
      'пять': '5',
      'шесть': '6',
      'семь': '7',
      'восемь': '8',
      'девять': '9',
      'десять': '10',
      'двадцать': '20',
      'тридцать': '30',
      'сорок': '40',
      'пятьдесят': '50',
      'сто': '100'
    };

    let processedExpr = expr.toLowerCase();
    
    Object.entries(russianToEnglish).forEach(([rus, eng]) => {
      processedExpr = processedExpr.replace(new RegExp(rus, 'gi'), ` ${eng} `);
    });

    processedExpr = processedExpr.replace(/[^0-9+\-*/().\s]/g, '').trim();
    
    if (!processedExpr) {
      throw new Error('Empty expression');
    }

    try {
      const result = Function(`'use strict'; return (${processedExpr})`)();
      return Math.round(result * 100) / 100;
    } catch (e) {
      throw new Error('Invalid expression');
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Голосовые команды не поддерживаются в вашем браузере');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setLastCommand('');
      setResponse('🎤 Слушаю команду...');
      setIsMinimized(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLastCommand(transcript);
      executeCommand(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      setResponse(`❌ Ошибка: ${event.error === 'no-speech' ? 'ничего не услышал' : 'не удалось распознать'}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
        >
          <Icon name="Mic" size={24} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Card className="w-80 p-4 dark:bg-gray-900 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Icon name="Mic" className="text-white" size={16} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">🎙️ Команды</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
            <Icon name="Minus" size={16} />
          </Button>
        </div>

        <Button
          onClick={startListening}
          disabled={isListening}
          className={`w-full mb-3 ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}`}
        >
          <Icon name={isListening ? "MicOff" : "Mic"} className="mr-2" size={18} />
          {isListening ? 'Слушаю...' : 'Голосовая команда'}
        </Button>

        {lastCommand && (
          <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Вы сказали:</p>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">"{lastCommand}"</p>
          </div>
        )}

        {response && (
          <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-medium">{response}</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Примеры команд:</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 p-1.5 rounded bg-gray-50 dark:bg-gray-800">
              <Icon name="Clock" size={12} className="text-indigo-500" />
              <span className="text-gray-600 dark:text-gray-400">"Сколько времени?"</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-gray-50 dark:bg-gray-800">
              <Icon name="Calendar" size={12} className="text-purple-500" />
              <span className="text-gray-600 dark:text-gray-400">"Какая сегодня дата?"</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-gray-50 dark:bg-gray-800">
              <Icon name="Calculator" size={12} className="text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">"Посчитай два плюс три"</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-gray-50 dark:bg-gray-800">
              <Icon name="Brain" size={12} className="text-orange-500" />
              <span className="text-gray-600 dark:text-gray-400">"Запомни купить молоко"</span>
            </div>
          </div>
        </div>

        {notes.length > 0 && (
          <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                📝 Заметок: {notes.length}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNotes([]);
                  localStorage.removeItem('voice_notes');
                  setResponse('🗑️ Заметки очищены');
                }}
                className="h-6 px-2 text-xs"
              >
                Очистить
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
