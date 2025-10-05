import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface RatingButtonsProps {
  messageIndex: number;
  messageText: string;
  onRate?: (rating: 'like' | 'dislike') => void;
}

export default function RatingButtons({ messageIndex, messageText, onRate }: RatingButtonsProps) {
  const [rating, setRating] = useState<'like' | 'dislike' | null>(null);
  const { toast } = useToast();

  const handleRate = (rate: 'like' | 'dislike') => {
    setRating(rate);
    
    const ratings = JSON.parse(localStorage.getItem('message_ratings') || '[]');
    ratings.push({
      messageIndex,
      messageText: messageText.substring(0, 100),
      rating: rate,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('message_ratings', JSON.stringify(ratings));
    
    if (onRate) onRate(rate);
    
    toast({
      title: rate === 'like' ? 'Спасибо за оценку! 👍' : 'Спасибо за отзыв 👎',
      description: rate === 'dislike' ? 'Мы учтём это для улучшения' : 'Рады, что вам помогли!',
    });
  };

  return (
    <div className="flex gap-2 mt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleRate('like')}
        disabled={rating !== null}
        className={`text-xs ${rating === 'like' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'text-gray-500 hover:text-green-600'}`}
      >
        <Icon name="ThumbsUp" size={14} className="mr-1" />
        {rating === 'like' ? 'Полезно' : 'Полезно'}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleRate('dislike')}
        disabled={rating !== null}
        className={`text-xs ${rating === 'dislike' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' : 'text-gray-500 hover:text-red-600'}`}
      >
        <Icon name="ThumbsDown" size={14} className="mr-1" />
        {rating === 'dislike' ? 'Не помогло' : 'Не помогло'}
      </Button>
    </div>
  );
}
