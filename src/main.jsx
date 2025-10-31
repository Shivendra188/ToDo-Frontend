import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { TodoProvider } from './contexts/TodoContext';
import { SettingsProvider } from './contexts/SettingsContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <TodoProvider>
        <App />
      </TodoProvider>
    </SettingsProvider>
  </React.StrictMode>
);
