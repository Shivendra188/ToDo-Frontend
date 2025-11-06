import React, { useState, useEffect, useMemo } from "react";
import styles from "./SearchBar.module.css";
import { debounce } from "../../utils/debounce";
import { Search, X } from "lucide-react"; // ✅ simple icons (if using lucide-react)

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  // ✅ Debounce search input
  const debounced = useMemo(() => debounce(onSearch, 350), [onSearch]);

  useEffect(() => {
    debounced(value);
  }, [value, debounced]);

  const clearSearch = () => setValue("");

  return (
    <div className={styles.search} role="search">
      <div className={styles.inputWrapper}>
        <Search size={18} className={styles.icon} />
        <input
          type="text"
          aria-label="Search todos"
          placeholder="Search by title, description, or tag..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={styles.input}
        />
        {value && (
          <button
            className={styles.clearBtn}
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
