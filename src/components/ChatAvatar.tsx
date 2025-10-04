import Icon from '@/components/ui/icon';

interface ChatAvatarProps {
  type: 'user' | 'ai';
  size?: number;
}

export default function ChatAvatar({ type, size = 32 }: ChatAvatarProps) {
  if (type === 'ai') {
    return (
      <div 
        className="rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <Icon name="Bot" className="text-white" size={size * 0.6} />
      </div>
    );
  }

  return (
    <div 
      className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <Icon name="User" className="text-white" size={size * 0.6} />
    </div>
  );
}
