import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Theme, ThemeContextType } from '../types';
import { SunIcon, MoonIcon } from './icons';

const ThemeToggle: React.FC = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    return null; // Make sure ThemeProvider wraps the app
  }

  const { theme, setTheme } = context as ThemeContextType;

  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-full 
        text-gray-600 dark:text-gray-300 
        bg-white dark:bg-gray-800
        hover:bg-gray-100 dark:hover:bg-gray-700 
        hover:scale-110 
        hover:shadow-md 
        active:shadow-[0_0_10px_2px_rgba(255,255,255,0.4)] dark:active:shadow-[0_0_10px_2px_rgba(255,255,255,0.2)]
        transition-all duration-300 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
      `}
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
