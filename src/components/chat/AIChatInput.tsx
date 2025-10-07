import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AIChatInputProps {
  input: string;
  isLoading: boolean;
  uploadedFiles: {name: string; content: string}[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

export default function AIChatInput({
  input,
  isLoading,
  uploadedFiles,
  fileInputRef,
  onInputChange,
  onKeyPress,
  onSend,
  onFileUpload,
  onRemoveFile
}: AIChatInputProps) {
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
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.doc,.docx,.md"
          multiple
          onChange={onFileUpload}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="dark:bg-gray-800 dark:border-gray-600"
          title="Загрузить документ"
        >
          <Icon name="Paperclip" size={18} />
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
