
// components/ThemeToggle.tsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 hover:ring-2 ring-blue-500 active:scale-95 shadow-sm"
      aria-label="Toggle Dark/Light Mode"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-blue-600 fill-blue-600" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400 fill-yellow-400" />
      )}
    </button>
  );
};
