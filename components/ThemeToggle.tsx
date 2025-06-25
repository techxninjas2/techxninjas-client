
import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Theme, ThemeContextType } from '../types';
import { SunIcon, MoonIcon } from './icons';

const ThemeToggle: React.FC = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    // This should ideally not happen if ThemeProvider wraps the app
    return null; 
  }
  const { theme, setTheme } = context as ThemeContextType;


  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label={theme === Theme.LIGHT ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === Theme.LIGHT ? (
        <MoonIcon className="w-5 h-5" />
      ) : (
        <SunIcon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
