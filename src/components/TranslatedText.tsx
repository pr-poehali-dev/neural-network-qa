import { useEffect, useState } from 'react';
import { useSiteTranslation } from '@/hooks/useSiteTranslation';

interface TranslatedTextProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export default function TranslatedText({ children, as: Component = 'span', className }: TranslatedTextProps) {
  const { language, translateText } = useSiteTranslation();
  const [translated, setTranslated] = useState(children);

  useEffect(() => {
    if (language === 'ru') {
      setTranslated(children);
      return;
    }

    let mounted = true;
    
    translateText(children).then(result => {
      if (mounted) {
        setTranslated(result);
      }
    });

    return () => {
      mounted = false;
    };
  }, [children, language, translateText]);

  return <Component className={className}>{translated}</Component>;
}
