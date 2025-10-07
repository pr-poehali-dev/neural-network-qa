import { useEffect } from 'react';

interface HotkeyConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
}

export function useHotkeys(hotkeys: HotkeyConfig[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      hotkeys.forEach(({ key, ctrl, shift, alt, callback }) => {
        const ctrlMatch = ctrl === undefined || ctrl === (e.ctrlKey || e.metaKey);
        const shiftMatch = shift === undefined || shift === e.shiftKey;
        const altMatch = alt === undefined || alt === e.altKey;
        const keyMatch = e.key.toLowerCase() === key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          e.preventDefault();
          callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkeys]);
}
