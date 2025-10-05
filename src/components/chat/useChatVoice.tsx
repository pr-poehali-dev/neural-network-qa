import { useState } from 'react';

interface UseChatVoiceProps {
  voiceLanguage: string;
  voiceSpeed: number;
  voiceGender: 'male' | 'female';
  autoDetectLanguage: boolean;
  translateToLanguage: string;
  onInputChange: (value: string) => void;
}

export function useChatVoice({
  voiceLanguage,
  voiceSpeed,
  voiceGender,
  autoDetectLanguage,
  translateToLanguage,
  onInputChange
}: UseChatVoiceProps) {
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDictationMode, setIsDictationMode] = useState(false);
  const [dictationText, setDictationText] = useState('');

  const getLanguageName = (code: string): string => {
    const languages: Record<string, string> = {
      'ru': 'Русский',
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'zh': '中文',
      'ja': '日本語',
      'ar': 'العربية',
      'pt': 'Português',
      'it': 'Italiano',
      'ko': '한국어',
      'tr': 'Türkçe',
      'pl': 'Polski',
      'uk': 'Українська',
      'hi': 'हिन्दी'
    };
    return languages[code] || code.toUpperCase();
  };

  const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      return data[0][0][0];
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const speakText = async (text: string, index: number) => {
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      setIsTranslating(false);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingIndex(index);

    const targetLang = voiceLanguage.split('-')[0];
    let textToSpeak = text;

    if (targetLang !== 'ru') {
      try {
        setIsTranslating(true);
        textToSpeak = await translateText(text, 'ru', targetLang);
        setIsTranslating(false);
      } catch (error) {
        console.error('Translation failed, using original text');
        setIsTranslating(false);
      }
    }

    const cleanText = textToSpeak
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]+`/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();

    const chunks = splitIntoChunks(cleanText, 200);
    
    const speakChunk = (chunkIndex: number) => {
      if (chunkIndex >= chunks.length) {
        setSpeakingIndex(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      utterance.lang = voiceLanguage;
      utterance.rate = voiceSpeed;
      utterance.volume = 1.0;
      utterance.pitch = voiceGender === 'male' ? 0.85 : 1.1;
      
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          voices = window.speechSynthesis.getVoices();
          setVoiceForUtterance(utterance, voices);
        }, { once: true });
      } else {
        setVoiceForUtterance(utterance, voices);
      }
      
      utterance.onend = () => {
        setTimeout(() => speakChunk(chunkIndex + 1), 100);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setSpeakingIndex(null);
      };
      
      window.speechSynthesis.speak(utterance);
    };

    speakChunk(0);
  };

  const setVoiceForUtterance = (utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[]) => {
    const langCode = voiceLanguage.split('-')[0];
    const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langCode));
    
    if (langVoices.length === 0) {
      const anyLangVoice = voices.find(v => v.lang.toLowerCase().includes(langCode));
      if (anyLangVoice) {
        utterance.voice = anyLangVoice;
      }
      return;
    }

    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (voiceGender === 'male') {
      selectedVoice = langVoices.find(v => 
        /male|man|мужской|мужчина|matthew|dmitry|yuri|андрей|артем/i.test(v.name)
      );
      
      if (!selectedVoice) {
        selectedVoice = langVoices.find(v => 
          !/female|woman|женский|женщина|alice|oksana|катя|милена/i.test(v.name)
        );
      }
      
      if (!selectedVoice && langVoices.length > 1) {
        selectedVoice = langVoices[1];
      }
    } else {
      selectedVoice = langVoices.find(v => 
        /female|woman|женский|женщина|alice|oksana|катя|милена|samantha|victoria/i.test(v.name)
      );
      
      if (!selectedVoice) {
        selectedVoice = langVoices[0];
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`Selected voice: ${selectedVoice.name} (${selectedVoice.lang}) - Gender: ${voiceGender}`);
    }
  };

  const splitIntoChunks = (text: string, maxLength: number): string[] => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxLength && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text];
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = autoDetectLanguage ? '' : voiceLanguage;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      
      if (autoDetectLanguage && translateToLanguage) {
        const detectedLang = (event.results[0][0] as any).language || 'auto';
        const sourceLangCode = detectedLang.split('-')[0];
        
        if (sourceLangCode !== translateToLanguage) {
          const translated = await translateText(transcript, sourceLangCode, translateToLanguage);
          onInputChange(`🌐 ${translated}\n\n📍 ${getLanguageName(sourceLangCode)} → ${getLanguageName(translateToLanguage)}`);
        } else {
          onInputChange(transcript);
        }
      } else {
        onInputChange(transcript);
      }
      
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const startDictationMode = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    if (isDictationMode) {
      setIsDictationMode(false);
      setIsListening(false);
      if (dictationText.trim()) {
        onInputChange(dictationText);
        setDictationText('');
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = voiceLanguage;
    recognition.continuous = true;
    recognition.interimResults = true;

    setIsDictationMode(true);
    setIsListening(true);
    setDictationText('');

    let silenceTimer: NodeJS.Timeout;
    let lastTranscript = '';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript = transcript;
        }
      }

      if (finalTranscript) {
        lastTranscript = finalTranscript;
        setDictationText(prev => prev + finalTranscript);
        
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          setDictationText(prev => prev + '. ');
        }, 1500);
      }
    };

    recognition.onerror = () => {
      setIsDictationMode(false);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isDictationMode) {
        recognition.start();
      }
    };

    recognition.start();
  };

  return {
    speakingIndex,
    isListening,
    isTranslating,
    isDictationMode,
    dictationText,
    speakText,
    startVoiceInput,
    startDictationMode
  };
}