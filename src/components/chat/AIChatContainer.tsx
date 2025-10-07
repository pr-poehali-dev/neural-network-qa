import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useTranslation } from '@/hooks/useTranslation';
import AIChatHeader from '@/components/chat/AIChatHeader';
import AIChatMessages, { Message } from '@/components/chat/AIChatMessages';
import AIChatInput from '@/components/chat/AIChatInput';
import AIChatStats from '@/components/chat/AIChatStats';
import SpecialCommands from '@/components/chat/SpecialCommands';
import ApiKeySetupGuide from '@/components/ApiKeySetupGuide';

interface AIChatContainerProps {
  embedded: boolean;
  isFullscreen: boolean;
  apiKey?: string;
  model: string;
  messages: Message[];
  isLoading: boolean;
  showQuickPrompts: boolean;
  showSpecialCommands: boolean;
  totalTokens: number;
  uploadedFiles: {name: string; content: string; type: 'text' | 'image'; dataUrl?: string}[];
  input: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  imageInputRef: React.RefObject<HTMLInputElement>;
  isAdmin: boolean;
  onClose: () => void;
  onToggleFullscreen: () => void;
  onExport: () => void;
  onClear: () => void;
  onQuickPrompt: (prompt: string) => void;
  onCopyMessage: (content: string) => void;
  onInputChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'text' | 'image') => void;
  onRemoveFile: (index: number) => void;
  onSpecialCommand: (prompt: string) => void;
  onToggleSpecialCommands: () => void;
  onModelChange?: (model: string) => void;
  translatedLanguage?: string | null;
  translatedMessages?: Map<number, string>;
  onTranslateAll?: (language: string) => void;
  isSpeaking?: boolean;
  currentSpeakingIndex?: number | null;
  onSpeakMessage?: (text: string, index: number, language: string) => void;
  onStopSpeaking?: () => void;
}

export default function AIChatContainer({
  embedded,
  isFullscreen,
  apiKey,
  model,
  messages,
  isLoading,
  showQuickPrompts,
  showSpecialCommands,
  totalTokens,
  uploadedFiles,
  input,
  messagesEndRef,
  fileInputRef,
  imageInputRef,
  isAdmin,
  onClose,
  onToggleFullscreen,
  onExport,
  onClear,
  onQuickPrompt,
  onCopyMessage,
  onInputChange,
  onKeyPress,
  onSend,
  onFileUpload,
  onRemoveFile,
  onSpecialCommand,
  onToggleSpecialCommands,
  onModelChange,
  translatedLanguage,
  translatedMessages,
  onTranslateAll,
  isSpeaking,
  currentSpeakingIndex,
  onSpeakMessage,
  onStopSpeaking
}: AIChatContainerProps) {
  const { t } = useTranslation();

  const containerClass = embedded 
    ? "w-full h-full bg-white dark:bg-gray-800 flex flex-col"
    : isFullscreen
      ? "fixed inset-0 z-[100] bg-white dark:bg-gray-800 flex flex-col"
      : "fixed bottom-6 right-6 z-50 w-96 bg-white dark:bg-gray-800 shadow-2xl flex flex-col animate-scale-in rounded-xl overflow-hidden h-[85vh] min-h-[700px] max-h-[900px]";

  return (
    <Card className={containerClass}>
      <AIChatHeader
        model={model}
        onExport={onExport}
        onClear={onClear}
        onClose={embedded ? undefined : onClose}
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
        onQuickPrompt={onQuickPrompt}
        onModelChange={onModelChange}
        onTranslateAll={onTranslateAll}
      />

      <AIChatStats
        totalTokens={totalTokens}
        messageCount={messages.length}
      />

      {!apiKey && !localStorage.getItem('openrouter_api_key') && (
        <ApiKeySetupGuide onOpenSettings={() => {
          if (!embedded) {
            onClose();
          }
          setTimeout(() => {
            const settingsBtn = document.querySelector('[data-settings-btn]') as HTMLElement;
            if (settingsBtn) {
              settingsBtn.click();
            } else {
              window.location.href = '/admin';
            }
          }, 100);
        }} />
      )}

      {showSpecialCommands ? (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-white">{t.chat.specialFunctions}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleSpecialCommands}
              className="text-white hover:bg-white/10"
            >
              <Icon name="X" size={18} />
            </Button>
          </div>
          <SpecialCommands onSelectCommand={onSpecialCommand} />
        </div>
      ) : (
        <AIChatMessages
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          onCopyMessage={onCopyMessage}
          showQuickPrompts={showQuickPrompts}
          onQuickPrompt={onQuickPrompt}
          translatedLanguage={translatedLanguage}
          translatedMessages={translatedMessages}
          isSpeaking={isSpeaking}
          currentSpeakingIndex={currentSpeakingIndex}
          onSpeakMessage={onSpeakMessage}
          onStopSpeaking={onStopSpeaking}
        />
      )}

      <div className="border-t dark:border-gray-700">
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSpecialCommands}
            className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
          >
            <Icon name="Wand2" size={16} className="mr-2" />
            {showSpecialCommands ? t.chat.backToChat : t.chat.specialFunctions}
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-400 hidden sm:flex items-center gap-1">
              <Icon name="Keyboard" size={10} />
              {t.chat.hotkey}
            </span>
            <span className="text-xs text-gray-500">30+ {t.chat.commands}</span>
          </div>
        </div>
        
        <AIChatInput
          input={input}
          isLoading={isLoading}
          uploadedFiles={uploadedFiles}
          fileInputRef={fileInputRef}
          imageInputRef={imageInputRef}
          onInputChange={onInputChange}
          onKeyPress={onKeyPress}
          onSend={onSend}
          onFileUpload={onFileUpload}
          onRemoveFile={onRemoveFile}
          isAdmin={isAdmin}
          currentModel={model}
        />
      </div>
    </Card>
  );
}