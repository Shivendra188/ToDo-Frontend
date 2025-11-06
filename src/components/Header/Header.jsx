import React from "react";
import styles from "./Header.module.css";
import { useSettings } from "../../contexts/SettingsContext";

export default function Header({ onAdd }) {
  const { theme, setTheme } = useSettings();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className={`${styles.header} row`} role="banner">
      <div className="col">
        <h1 className={styles.title}>Todo</h1>
        <p className={styles.subtitle}>
          Plan your day — quick, accessible, and keyboard friendly
        </p>
      </div>

      <div className={`${styles.actions} row`}>
        <button
          aria-pressed={theme === "dark"}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
          className="btn ghost"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button className="btn" onClick={onAdd} aria-label="Add new todo">
          + Add Task
        </button>
      </div>
    </header>
  );
}
