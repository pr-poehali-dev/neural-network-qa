import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';

interface SuggestionsGridProps {
  onSelectSuggestion: (text: string) => void;
}

export default function SuggestionsGrid({ onSelectSuggestion }: SuggestionsGridProps) {
  const { t } = useLanguage();
  
  return (
    <div className="mt-12 mb-8">
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">{t('examples.title')}</h3>
      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <Card 
          className="p-4 border-2 border-purple-200 dark:border-purple-800 dark:bg-gray-800 hover:border-indigo-400 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => onSelectSuggestion(t('examples.prices'))}
        >
          <div className="flex items-start gap-3">
            <Icon name="Search" className="text-indigo-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{t('examples.prices')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('examples.pricesDesc')}</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 border-2 border-purple-200 dark:border-purple-800 dark:bg-gray-800 hover:border-pink-400 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => onSelectSuggestion(t('examples.contacts'))}
        >
          <div className="flex items-start gap-3">
            <Icon name="Phone" className="text-pink-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{t('examples.contacts')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('examples.contactsDesc')}</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 border-2 border-purple-200 dark:border-purple-800 dark:bg-gray-800 hover:border-green-400 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => onSelectSuggestion(t('examples.summary'))}
        >
          <div className="flex items-start gap-3">
            <Icon name="FileText" className="text-green-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{t('examples.summary')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('examples.summaryDesc')}</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 border-2 border-purple-200 dark:border-purple-800 dark:bg-gray-800 hover:border-orange-400 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => onSelectSuggestion(t('examples.dates'))}
        >
          <div className="flex items-start gap-3">
            <Icon name="Calendar" className="text-orange-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{t('examples.dates')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('examples.datesDesc')}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}