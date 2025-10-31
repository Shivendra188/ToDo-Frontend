import React, { useState, useEffect, useMemo } from 'react';
import styles from './SearchBar.module.css';
import { debounce } from '../../utils/debounce';

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');

  // debounce calls to onSearch
  const debounced = useMemo(() => debounce(onSearch, 350), [onSearch]);

  useEffect(() => {
    debounced(value);
  }, [value, debounced]);

  return (
    <div className={styles.search} role="search">
      <input
        aria-label="Search todos"
        placeholder="Search by title, description or tag..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={styles.input}
      />
      {value && (
        <button className="btn ghost" onClick={() => setValue('')} aria-label="Clear search">Clear</button>
      )}
    </div>
  );
}
