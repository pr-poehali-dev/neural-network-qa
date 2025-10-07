import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useHotkeys } from '@/hooks/useHotkeys';
import { useTranslation } from '@/hooks/useTranslation';
import { useAIChatState } from '@/hooks/useAIChatState';
import { useAIChatHandlers } from '@/hooks/useAIChatHandlers';
import AIChatContainer from '@/components/chat/AIChatContainer';

interface AIChatButtonProps {
  className?: string;
  apiKey?: string;
  model?: string;
  embedded?: boolean;
  isAdmin?: boolean;
}

export default function AIChatButton({ 
  className = '',
  apiKey,
  model = 'google/gemini-2.0-flash-exp:free',
  embedded = false,
  isAdmin = false
}: AIChatButtonProps) {
  const { toast } = useToast();
  const { t } = useTranslation();

  const state = useAIChatState({ embedded, apiKey });
  
  const handlers = useAIChatHandlers({
    apiKey,
    model,
    messages: state.messages,
    setMessages: state.setMessages,
    input: state.input,
    setInput: state.setInput,
    uploadedFiles: state.uploadedFiles,
    setUploadedFiles: state.setUploadedFiles,
    setIsLoading: state.setIsLoading,
    setShowQuickPrompts: state.setShowQuickPrompts,
    setTotalTokens: state.setTotalTokens,
    fileInputRef: state.fileInputRef,
    imageInputRef: state.imageInputRef
  });

  useHotkeys([
    {
      key: 'k',
      ctrl: true,
      callback: () => {
        if (!embedded) {
          state.setShowChat(!state.showChat);
          toast({ 
            title: state.showChat ? t.notifications.chatClosed : t.notifications.chatOpened, 
            description: t.notifications.toggleHotkey 
          });
        }
      }
    },
    {
      key: 'Escape',
      callback: () => {
        if (state.isFullscreen) {
          state.setIsFullscreen(false);
          toast({ 
            title: t.notifications.exitFullscreen, 
            description: t.notifications.fullscreenHint 
          });
        } else if (state.showChat && !embedded) {
          state.setShowChat(false);
        }
      }
    },
    {
      key: 'F11',
      callback: () => {
        if (state.showChat) {
          state.setIsFullscreen(!state.isFullscreen);
          toast({ 
            title: state.isFullscreen ? t.notifications.normalMode : t.notifications.fullscreenMode, 
            description: t.notifications.escToExit 
          });
        }
      }
    }
  ]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlers.sendMessage();
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    state.setInput(promptText + ' ');
    state.setShowQuickPrompts(false);
  };

  const handleSpecialCommand = (prompt: string) => {
    state.setInput(prompt);
    state.setShowSpecialCommands(false);
    state.setShowQuickPrompts(false);
  };

  if (state.showChat) {
    return (
      <AIChatContainer
        embedded={embedded}
        isFullscreen={state.isFullscreen}
        apiKey={apiKey}
        model={model}
        messages={state.messages}
        isLoading={state.isLoading}
        showQuickPrompts={state.showQuickPrompts}
        showSpecialCommands={state.showSpecialCommands}
        totalTokens={state.totalTokens}
        uploadedFiles={state.uploadedFiles}
        input={state.input}
        messagesEndRef={state.messagesEndRef}
        fileInputRef={state.fileInputRef}
        imageInputRef={state.imageInputRef}
        isAdmin={isAdmin}
        onClose={() => state.setShowChat(false)}
        onToggleFullscreen={() => state.setIsFullscreen(!state.isFullscreen)}
        onExport={handlers.exportChat}
        onClear={handlers.clearHistory}
        onQuickPrompt={handleQuickPrompt}
        onCopyMessage={handlers.copyMessage}
        onInputChange={state.setInput}
        onKeyPress={handleKeyPress}
        onSend={() => handlers.sendMessage()}
        onFileUpload={handlers.handleFileUpload}
        onRemoveFile={handlers.removeFile}
        onSpecialCommand={handleSpecialCommand}
        onToggleSpecialCommands={() => state.setShowSpecialCommands(!state.showSpecialCommands)}
      />
    );
  }

  if (embedded) return null;

  return (
    <Button
      onClick={() => state.setShowChat(true)}
      size="lg"
      className={`fixed bottom-6 right-6 z-40 rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-110 transition-transform ${className}`}
      title="Открыть AI-чат"
    >
      <Icon name="Bot" size={28} />
    </Button>
  );
}
