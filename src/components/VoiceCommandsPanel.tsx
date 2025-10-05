import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface VoiceCommand {
  command: string;
  action: string;
  response: string;
  icon: string;
}

const voiceCommands: VoiceCommand[] = [
  { command: 'время', action: 'show_time', response: '', icon: 'Clock' },
  { command: 'дата', action: 'show_date', response: '', icon: 'Calendar' },
  { command: 'калькулятор', action: 'calculator', response: '', icon: 'Calculator' },
  { command: 'переведи', action: 'translate', response: '', icon: 'Languages' },
  { command: 'посчитай', action: 'calculate', response: '', icon: 'Hash' },
  { command: 'запомни', action: 'remember', response: '', icon: 'Brain' },
  { command: 'погода', action: 'weather', response: '', icon: 'Cloud' },
];

export default function VoiceCommandsPanel() {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [response, setResponse] = useState('');
  const [notes, setNotes] = useState<string[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('voice_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const executeCommand = (transcript: string) => {
    const lower = transcript.toLowerCase();
    
    if (lower.includes('время')) {
      const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      setResponse(`⏰ Сейчас ${time}`);
      speak(`Сейчас ${time}`);
    } 
    else if (lower.includes('дата')) {
      const date = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
      setResponse(`📅 Сегодня ${date}`);
      speak(`Сегодня ${date}`);
    }
    else if (lower.includes('посчитай') || lower.includes('вычисли')) {
      const mathExpression = lower.replace(/посчитай|вычисли|сколько будет/gi, '').trim();
      try {
        const result = evaluateMath(mathExpression);
        setResponse(`🔢 Результат: ${result}`);
        speak(`Результат: ${result}`);
      } catch {
        setResponse('❌ Не могу вычислить');
      }
    }
    else if (lower.includes('запомни')) {
      const note = transcript.replace(/запомни/gi, '').trim();
      const newNotes = [...notes, note];
      setNotes(newNotes);
      localStorage.setItem('voice_notes', JSON.stringify(newNotes));
      setResponse(`💾 Запомнил: ${note}`);
      speak('Запомнил');
    }
    else if (lower.includes('что ты запомнил') || lower.includes('мои заметки')) {
      if (notes.length === 0) {
        setResponse('📝 Заметок пока нет');
        speak('У меня нет заметок');
      } else {
        setResponse(`📝 Ваши заметки:\n${notes.map((n, i) => `${i + 1}. ${n}`).join('\n')}`);
        speak(`У вас ${notes.length} заметок`);
      }
    }
    else if (lower.includes('очистить заметки')) {
      setNotes([]);
      localStorage.removeItem('voice_notes');
      setResponse('🗑️ Заметки очищены');
      speak('Заметки очищены');
    }
    else {
      setResponse(`❓ Команда не распознана: "${transcript}"`);
    }
  };

  const evaluateMath = (expr: string): number => {
    const russianToEnglish: Record<string, string> = {
      'плюс': '+',
      'минус': '-',
      'умножить на': '*',
      'разделить на': '/',
      'умножить': '*',
      'разделить': '/',
      'один': '1', 'два': '2', 'три': '3', 'четыре': '4', 'пять': '5',
      'шесть': '6', 'семь': '7', 'восемь': '8', 'девять': '9', 'десять': '10'
    };

    let processedExpr = expr;
    Object.entries(russianToEnglish).forEach(([rus, eng]) => {
      processedExpr = processedExpr.replace(new RegExp(rus, 'gi'), eng);
    });

    processedExpr = processedExpr.replace(/[^0-9+\-*/().\s]/g, '');
    
    return Function(`'use strict'; return (${processedExpr})`)();
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 1.0;
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
      setResponse('🎤 Слушаю...');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLastCommand(transcript);
      executeCommand(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setResponse('❌ Ошибка распознавания');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Card className="w-80 p-4 dark:bg-gray-900 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Icon name="Mic" className="text-white" size={16} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">🎙️ Голосовые команды</h3>
          </div>
        </div>

        <Button
          onClick={startListening}
          disabled={isListening}
          className={`w-full mb-3 ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}`}
        >
          <Icon name={isListening ? "MicOff" : "Mic"} className="mr-2" size={18} />
          {isListening ? 'Слушаю...' : 'Начать голосовую команду'}
        </Button>

        {lastCommand && (
          <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Команда:</p>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">"{lastCommand}"</p>
          </div>
        )}

        {response && (
          <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{response}</p>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Доступные команды:</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center gap-1">
              <Icon name="Clock" size={12} className="text-indigo-500" />
              <span className="text-gray-600 dark:text-gray-400">время</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Calendar" size={12} className="text-purple-500" />
              <span className="text-gray-600 dark:text-gray-400">дата</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Calculator" size={12} className="text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">посчитай</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Brain" size={12} className="text-orange-500" />
              <span className="text-gray-600 dark:text-gray-400">запомни</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
