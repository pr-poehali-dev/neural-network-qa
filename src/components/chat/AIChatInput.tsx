import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AIChatInputProps {
  input: string;
  isLoading: boolean;
  uploadedFiles: {name: string; content: string}[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  imageInputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'text' | 'image') => void;
  onRemoveFile: (index: number) => void;
  isAdmin?: boolean;
}

export default function AIChatInput({
  input,
  isLoading,
  uploadedFiles,
  fileInputRef,
  imageInputRef,
  onInputChange,
  onKeyPress,
  onSend,
  onFileUpload,
  onRemoveFile,
  isAdmin = false
}: AIChatInputProps) {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Голосовой ввод не поддерживается',
        description: 'Используйте браузер Chrome или Edge',
        variant: 'destructive'
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast({ title: '🎤 Говорите...' });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onInputChange(input + (input ? ' ' : '') + transcript);
      toast({ title: 'Распознано', description: transcript });
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast({
        title: 'Ошибка распознавания',
        description: 'Попробуйте ещё раз',
        variant: 'destructive'
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      {uploadedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {uploadedFiles.map((file, idx) => (
            <div key={idx} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Icon name="FileText" size={12} />
              <span className="max-w-[120px] truncate">{file.name}</span>
              <button
                onClick={() => onRemoveFile(idx)}
                className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        {isAdmin && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx,.md"
              multiple
              onChange={(e) => onFileUpload(e, 'text')}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="dark:bg-gray-800 dark:border-gray-600"
              title="Загрузить документ (только админ)"
            >
              <Icon name="Paperclip" size={18} />
            </Button>
          </>
        )}
        
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => onFileUpload(e, 'image')}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => imageInputRef.current?.click()}
          disabled={isLoading}
          className="dark:bg-gray-800 dark:border-gray-600"
          title="Загрузить изображение"
        >
          <Icon name="Image" size={18} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={startVoiceInput}
          disabled={isLoading || isListening}
          className={`dark:bg-gray-800 dark:border-gray-600 ${isListening ? 'animate-pulse bg-red-500 text-white' : ''}`}
          title="Голосовой ввод"
        >
          <Icon name="Mic" size={18} />
        </Button>

        <Input
          placeholder="Напишите сообщение..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          disabled={isLoading}
          className="dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
        />
        <Button 
          onClick={onSend}
          disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {isLoading ? (
            <Icon name="Loader2" className="animate-spin" size={18} />
          ) : (
            <Icon name="Send" size={18} />
          )}
        </Button>
      </div>
    </div>
  );
}