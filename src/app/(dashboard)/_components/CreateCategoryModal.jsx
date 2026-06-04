"use client";

import { useEffect, useRef } from "react";
import styles from "./dashboard.module.css";

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CreateCategoryModal({ open, value, error, onChange, onClose, onCreate }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="presentation">
      <div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-category-title"
      >
        <div className={styles.modalHeader}>
          <h2 id="create-category-title" className={styles.modalTitle}>
            Create Category
          </h2>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.modalBody}>
          <label htmlFor="category-name" className={styles.modalLabel}>
            Category
          </label>
          <input
            ref={inputRef}
            id="category-name"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Category"
            className={`${styles.modalInput} ${error ? styles.modalInputError : ""}`}
            onKeyDown={(e) => {
              if (e.key === "Enter") onCreate();
            }}
          />
          {error && <p className={styles.modalError}>{error}</p>}
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.modalCancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.modalCreateBtn} onClick={onCreate}>
            <span className={styles.modalCreateIcon}>
              <PlusIcon />
            </span>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
