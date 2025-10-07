import { useState, useRef, useEffect } from 'react';
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

  const [currentModel, setCurrentModel] = useState(model);
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('chat_button_position');
    return saved ? JSON.parse(saved) : { bottom: 24, right: 24 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const state = useAIChatState({ embedded, apiKey });
  
  const handlers = useAIChatHandlers({
    apiKey,
    model: currentModel,
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

  const handleModelChange = (newModel: string) => {
    setCurrentModel(newModel);
  };

  useEffect(() => {
    localStorage.setItem('chat_button_position', JSON.stringify(position));
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    setIsDragging(true);
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newRight = window.innerWidth - e.clientX - dragOffset.x + 32;
      const newBottom = window.innerHeight - e.clientY - dragOffset.y + 32;
      
      setPosition({
        bottom: Math.max(24, Math.min(window.innerHeight - 88, newBottom)),
        right: Math.max(24, Math.min(window.innerWidth - 88, newRight))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

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
        model={currentModel}
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
        onModelChange={handleModelChange}
        translatedLanguage={state.translatedLanguage}
        translatedMessages={state.translatedMessages}
        onTranslateAll={(lang) => handlers.translateAllMessages(lang, state.setTranslatedLanguage, state.setTranslatedMessages)}
        isSpeaking={state.isSpeaking}
        currentSpeakingIndex={state.currentSpeakingIndex}
        onSpeakMessage={(text, index, lang) => handlers.speakMessage(text, index, lang, state.setIsSpeaking, state.setCurrentSpeakingIndex)}
        onStopSpeaking={() => handlers.stopSpeaking(state.setIsSpeaking, state.setCurrentSpeakingIndex)}
      />
    );
  }

  if (embedded) return null;

  return (
    <Button
      ref={buttonRef}
      onClick={() => state.setShowChat(true)}
      onMouseDown={handleMouseDown}
      size="lg"
      style={{ 
        bottom: `${position.bottom}px`, 
        right: `${position.right}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      className={`fixed z-40 rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-110 transition-transform ${isDragging ? 'scale-105' : ''} ${className}`}
      title="Открыть AI-чат (можно перетащить)"
    >
      <Icon name="Bot" size={28} />
    </Button>
  );
}