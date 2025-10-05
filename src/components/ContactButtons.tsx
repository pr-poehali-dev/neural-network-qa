import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ContactButtonsProps {
  whatsapp?: string;
  telegram?: string;
  className?: string;
}

export default function ContactButtons({ whatsapp, telegram, className = '' }: ContactButtonsProps) {
  const handleWhatsApp = () => {
    if (whatsapp) {
      const cleanNumber = whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    }
  };

  const handleTelegram = () => {
    if (telegram) {
      const username = telegram.replace('@', '');
      window.open(`https://t.me/${username}`, '_blank');
    }
  };

  if (!whatsapp && !telegram) return null;

  return (
    <div className={`fixed bottom-6 right-6 flex flex-col gap-3 z-40 ${className}`}>
      {whatsapp && (
        <Button
          onClick={handleWhatsApp}
          size="lg"
          className="bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg rounded-full w-14 h-14 p-0 animate-bounce-slow"
          title="Написать в WhatsApp"
        >
          <Icon name="MessageCircle" size={24} />
        </Button>
      )}
      
      {telegram && (
        <Button
          onClick={handleTelegram}
          size="lg"
          className="bg-[#0088cc] hover:bg-[#006699] text-white shadow-lg rounded-full w-14 h-14 p-0 animate-bounce-slow"
          title="Написать в Telegram"
        >
          <Icon name="Send" size={24} />
        </Button>
      )}
    </div>
  );
}
