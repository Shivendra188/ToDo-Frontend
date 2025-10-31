import React from 'react';
import styles from './Header.module.css';
import { useSettings } from '../../contexts/SettingsContext';

export default function Header({ onAdd }) {
  const { theme, setTheme } = useSettings();

  return (
    <header className={`${styles.header} row`} role="banner">
      <div className="col">
        <h1 style={{ margin: 0 }}>Todo</h1>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13 }}>Plan your day — quick, accessible, and keyboard friendly</p>
      </div>
      <div style={{ marginLeft: 'auto' }} className="row">
        <button
          aria-pressed={theme === 'dark'}
          title="Toggle theme"
          className="btn ghost"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        <button className="btn" onClick={onAdd} aria-label="Add todo">+ Add</button>
      </div>
    </header>
  );
}
