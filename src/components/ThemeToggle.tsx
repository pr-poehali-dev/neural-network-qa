import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type Theme = 'light' | 'dark' | 'auto';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    setShowDropdown(false);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light': return 'Sun';
      case 'dark': return 'Moon';
      case 'auto': return 'Monitor';
    }
  };

  const themes: { value: Theme; icon: string; label: string }[] = [
    { value: 'light', icon: 'Sun', label: 'Светлая' },
    { value: 'dark', icon: 'Moon', label: 'Тёмная' },
    { value: 'auto', icon: 'Monitor', label: 'Авто' },
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110"
      >
        <Icon name={getIcon() as any} size={16} />
      </Button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute top-full right-0 mt-2 bg-gray-800/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl z-50 overflow-hidden min-w-[140px]">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => changeTheme(t.value)}
                className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3 ${
                  theme === t.value ? 'bg-white/10 text-white' : 'text-gray-300'
                }`}
              >
                <Icon name={t.icon as any} size={16} />
                <span className="text-sm font-medium">{t.label}</span>
                {theme === t.value && (
                  <Icon name="Check" size={14} className="ml-auto text-green-400" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
