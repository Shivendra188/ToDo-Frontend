import React, { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS } from "../services/storage";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // 'light' | 'dark'
  const [view, setView] = useState("expanded"); // 'compact' | 'expanded'
  const [defaultSort, setDefaultSort] = useState("dueDate"); // 'dueDate' | 'priority' | 'createdAt'

  // ✅ Load settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.view) setView(parsed.view);
        if (parsed.defaultSort) setDefaultSort(parsed.defaultSort);
      }
    } catch (err) {
      console.warn("⚠️ Failed to parse saved settings:", err);
    }
  }, []);

  // ✅ Apply theme + persist settings
  useEffect(() => {
    document.body.classList.toggle("theme-dark", theme === "dark");

    localStorage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify({ theme, view, defaultSort })
    );
  }, [theme, view, defaultSort]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleView = () => setView((v) => (v === "compact" ? "expanded" : "compact"));

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        view,
        setView,
        toggleView,
        defaultSort,
        setDefaultSort,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
