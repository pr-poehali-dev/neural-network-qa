import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VoiceDiagnostics() {
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const { voiceLanguage, voiceSpeed, voiceGender, favoriteVoiceName, setFavoriteVoiceName } = useLanguage();

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      console.log('Available voices:', voices.length);
    };

    loadVoices();
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const testVoice = (voice?: SpeechSynthesisVoice) => {
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const testTexts: Record<string, string> = {
      'ru': 'Привет! Это тестовая озвучка русского текста. Сейчас вы слышите мой голос.',
      'en': 'Hello! This is a test of English text-to-speech. You are now hearing my voice.',
      'es': '¡Hola! Esta es una prueba de texto a voz en español. Ahora estás escuchando mi voz.',
      'fr': 'Bonjour! Ceci est un test de synthèse vocale en français. Vous entendez maintenant ma voix.',
      'de': 'Hallo! Dies ist ein Test der deutschen Sprachsynthese. Sie hören jetzt meine Stimme.',
      'uk': 'Привіт! Це тестова озвучка українського тексту. Зараз ви чуєте мій голос.'
    };

    const langCode = voice ? voice.lang.split('-')[0] : voiceLanguage.split('-')[0];
    const testText = testTexts[langCode] || testTexts['en'];

    const utterance = new SpeechSynthesisUtterance(testText);
    utterance.lang = voice ? voice.lang : voiceLanguage;
    utterance.rate = voiceSpeed;
    utterance.pitch = voiceGender === 'male' ? 0.85 : 1.1;
    utterance.volume = 1.0;

    if (voice) {
      utterance.voice = voice;
      setSelectedVoice(voice.name);
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setSelectedVoice('');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSelectedVoice('');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSelectedVoice('');
  };

  const saveFavoriteVoice = (voiceName: string) => {
    setFavoriteVoiceName(voiceName);
  };

  const removeFavoriteVoice = () => {
    setFavoriteVoiceName(null);
  };

  const langCode = voiceLanguage.split('-')[0];
  const relevantVoices = availableVoices.filter(v => 
    v.lang.toLowerCase().startsWith(langCode)
  );

  const maleVoices = relevantVoices.filter(v => 
    /male|man|мужской|мужчина|matthew|dmitry|yuri|андрей|артем/i.test(v.name)
  );

  const femaleVoices = relevantVoices.filter(v => 
    /female|woman|женский|женщина|alice|oksana|катя|милена|samantha|victoria/i.test(v.name)
  );

  const otherVoices = relevantVoices.filter(v => 
    !maleVoices.includes(v) && !femaleVoices.includes(v)
  );

  return (
    <Card className="p-6 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          🔊 Диагностика голосов
        </h3>
        {isSpeaking && (
          <Button onClick={stopSpeaking} variant="destructive" size="sm">
            <Icon name="Square" className="mr-2" size={16} />
            Остановить
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Текущие настройки:
          </p>
          <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
            <p>• Язык: {voiceLanguage}</p>
            <p>• Скорость: {voiceSpeed}x</p>
            <p>• Пол: {voiceGender === 'male' ? 'Мужской' : 'Женский'}</p>
            <p>• Всего голосов: {availableVoices.length}</p>
            <p>• Подходящих: {relevantVoices.length}</p>
            {favoriteVoiceName && <p>• ⭐ Избранный: {favoriteVoiceName}</p>}
          </div>
        </div>

        <div>
          <Button 
            onClick={() => testVoice()} 
            disabled={isSpeaking}
            className="w-full mb-3"
          >
            <Icon name="Play" className="mr-2" size={16} />
            Тестировать с текущими настройками
          </Button>
        </div>

        {maleVoices.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              👨 Мужские голоса ({maleVoices.length})
            </h4>
            <div className="space-y-2">
              {maleVoices.map((voice) => (
                <div 
                  key={voice.name}
                  className={`flex items-center justify-between p-2 rounded border ${
                    selectedVoice === voice.name 
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-500' 
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      {voice.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {voice.lang} • {voice.localService ? 'Локальный' : 'Облачный'}
                    </p>
                  </div>
                  <Button 
                    onClick={() => testVoice(voice)} 
                    disabled={isSpeaking && selectedVoice !== voice.name}
                    size="sm"
                    variant="ghost"
                  >
                    <Icon name={selectedVoice === voice.name ? "Volume2" : "Play"} size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {femaleVoices.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              👩 Женские голоса ({femaleVoices.length})
            </h4>
            <div className="space-y-2">
              {femaleVoices.map((voice) => (
                <div 
                  key={voice.name}
                  className={`flex items-center justify-between p-2 rounded border ${
                    selectedVoice === voice.name 
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500' 
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      {favoriteVoiceName === voice.name && '⭐ '}{voice.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {voice.lang} • {voice.localService ? 'Локальный' : 'Облачный'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      onClick={() => testVoice(voice)} 
                      disabled={isSpeaking && selectedVoice !== voice.name}
                      size="sm"
                      variant="ghost"
                      title="Прослушать"
                    >
                      <Icon name={selectedVoice === voice.name ? "Volume2" : "Play"} size={14} />
                    </Button>
                    {favoriteVoiceName === voice.name ? (
                      <Button 
                        onClick={removeFavoriteVoice}
                        size="sm"
                        variant="ghost"
                        className="text-yellow-500 hover:text-yellow-600"
                        title="Убрать из избранного"
                      >
                        <Icon name="Star" size={14} fill="currentColor" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => saveFavoriteVoice(voice.name)}
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-yellow-500"
                        title="Добавить в избранное"
                      >
                        <Icon name="Star" size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {otherVoices.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              🎭 Другие голоса ({otherVoices.length})
            </h4>
            <div className="space-y-2">
              {otherVoices.map((voice) => (
                <div 
                  key={voice.name}
                  className={`flex items-center justify-between p-2 rounded border ${
                    selectedVoice === voice.name 
                      ? 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-500' 
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      {favoriteVoiceName === voice.name && '⭐ '}{voice.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {voice.lang} • {voice.localService ? 'Локальный' : 'Облачный'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      onClick={() => testVoice(voice)} 
                      disabled={isSpeaking && selectedVoice !== voice.name}
                      size="sm"
                      variant="ghost"
                      title="Прослушать"
                    >
                      <Icon name={selectedVoice === voice.name ? "Volume2" : "Play"} size={14} />
                    </Button>
                    {favoriteVoiceName === voice.name ? (
                      <Button 
                        onClick={removeFavoriteVoice}
                        size="sm"
                        variant="ghost"
                        className="text-yellow-500 hover:text-yellow-600"
                        title="Убрать из избранного"
                      >
                        <Icon name="Star" size={14} fill="currentColor" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => saveFavoriteVoice(voice.name)}
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-yellow-500"
                        title="Добавить в избранное"
                      >
                        <Icon name="Star" size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {relevantVoices.length === 0 && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-center">
            <Icon name="AlertTriangle" className="mx-auto mb-2 text-yellow-600" size={24} />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Голоса для языка {voiceLanguage} не найдены
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              Попробуйте выбрать другой язык в настройках
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <details className="text-xs">
            <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300 mb-2">
              📋 Что делать, если голоса не работают?
            </summary>
            <div className="space-y-2 text-gray-600 dark:text-gray-400 mt-2 pl-4">
              <p>✓ Проверьте, что ваш браузер поддерживает озвучку (Chrome, Edge, Safari работают лучше всего)</p>
              <p>✓ Убедитесь, что звук не выключен в системе</p>
              <p>✓ Попробуйте перезагрузить страницу</p>
              <p>✓ На macOS/iOS некоторые голоса нужно скачать в Настройках → Универсальный доступ → Речь</p>
              <p>✓ В Windows зайдите в Настройки → Время и язык → Речь → Управление голосами</p>
            </div>
          </details>
        </div>
      </div>
    </Card>
  );
}