import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../services/storage';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'
  const [view, setView] = useState('expanded'); // 'compact' | 'expanded'
  const [defaultSort, setDefaultSort] = useState('dueDate'); // 'dueDate' | 'priority' | 'createdAt'

  // load saved settings from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.theme) setTheme(s.theme);
        if (s.view) setView(s.view);
        if (s.defaultSort) setDefaultSort(s.defaultSort);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // apply theme to body class
  useEffect(() => {
    if (theme === 'dark') document.body.classList.add('theme-dark');
    else document.body.classList.remove('theme-dark');

    localStorage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify({ theme, view, defaultSort })
    );
  }, [theme, view, defaultSort]);

  return (
    <SettingsContext.Provider
      value={{ theme, setTheme, view, setView, defaultSort, setDefaultSort }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
