import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import ChatHeader from './chat/ChatHeader';
import ChatMessageList from './chat/ChatMessageList';
import ChatInput from './chat/ChatInput';
import { useChatVoice } from './chat/useChatVoice';
import { useChatSuggestions } from './chat/useChatSuggestions';
import { processCommand } from '@/utils/commandProcessor';

export interface Message {
  role: 'user' | 'ai';
  text: string;
  file?: any;
  imageUrl?: string;
  images?: Array<{name: string; base64: string; mimeType: string}>;
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
  onAddMessage?: (message: Message) => void;
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
  onOpenReadingMode,
  onAddMessage
}: ChatContainerProps) {
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const { voiceLanguage, translateToLanguage, autoDetectLanguage, voiceSpeed, voiceGender } = useLanguage();
  
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
    voiceGender,
    autoDetectLanguage,
    translateToLanguage,
    onInputChange
  });

  const { getSmartSuggestions } = useChatSuggestions();

  const handleSendMessage = () => {
    const commandResult = processCommand(inputMessage);
    
    if (commandResult.isCommand && commandResult.response && onAddMessage) {
      onAddMessage({ role: 'user', text: inputMessage });
      onAddMessage({ role: 'ai', text: commandResult.response });
      onInputChange('');
    } else {
      onSendMessage();
    }
  };

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
        onSendMessage={handleSendMessage}
        onToggleQuickReplies={() => setShowQuickReplies(!showQuickReplies)}
        onStartDictation={startDictationMode}
        getSmartSuggestions={getSmartSuggestions}
      />
    </Card>
  );
}