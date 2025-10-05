import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import ChatHeader from './chat/ChatHeader';
import ChatMessageList from './chat/ChatMessageList';
import ChatInput from './chat/ChatInput';
import { useChatVoice } from './chat/useChatVoice';
import { useChatSuggestions } from './chat/useChatSuggestions';

export interface Message {
  role: 'user' | 'ai';
  text: string;
  file?: any;
  imageUrl?: string;
  isFavorite?: boolean;
  detectedLanguage?: string;
  translatedFrom?: string;
}

interface ChatContainerProps {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  isGeneratingImage: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onGenerateImage: () => void;
  onSaveChat: () => void;
  onExportChat: () => void;
  onClearChat: () => void;
  onToggleFavorite?: (index: number) => void;
  onOpenReadingMode?: () => void;
}

export default function ChatContainer({
  messages,
  inputMessage,
  isLoading,
  isGeneratingImage,
  onInputChange,
  onSendMessage,
  onGenerateImage,
  onSaveChat,
  onExportChat,
  onClearChat,
  onToggleFavorite,
  onOpenReadingMode
}: ChatContainerProps) {
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const { voiceLanguage, translateToLanguage, autoDetectLanguage, voiceSpeed } = useLanguage();
  
  const {
    speakingIndex,
    isListening,
    isTranslating,
    isDictationMode,
    dictationText,
    speakText,
    startVoiceInput,
    startDictationMode
  } = useChatVoice({
    voiceLanguage,
    voiceSpeed,
    autoDetectLanguage,
    translateToLanguage,
    onInputChange
  });

  const { getSmartSuggestions } = useChatSuggestions();

  return (
    <Card className="p-8 border-2 border-purple-200 dark:border-purple-800 dark:bg-gray-900 flex flex-col animate-slide-up min-h-[600px]">
      <ChatHeader
        messageCount={messages.length}
        onExportChat={onExportChat}
        onClearChat={onClearChat}
        onOpenReadingMode={onOpenReadingMode}
      />

      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        speakingIndex={speakingIndex}
        isTranslating={isTranslating}
        onSpeak={speakText}
      />

      <ChatInput
        inputMessage={inputMessage}
        isLoading={isLoading}
        isGeneratingImage={isGeneratingImage}
        isListening={isListening}
        isDictationMode={isDictationMode}
        dictationText={dictationText}
        showQuickReplies={showQuickReplies}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
        onToggleQuickReplies={() => setShowQuickReplies(!showQuickReplies)}
        onStartDictation={startDictationMode}
        getSmartSuggestions={getSmartSuggestions}
      />
    </Card>
  );
}