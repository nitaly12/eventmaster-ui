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

function EditIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function UpdateCategoryModal({ open, value, error, onChange, onClose, onUpdate }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      inputRef.current?.select();
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
        aria-labelledby="update-category-title"
      >
        <div className={styles.modalHeader}>
          <h2 id="update-category-title" className={styles.modalTitle}>
            Update Category
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
          <input
            ref={inputRef}
            id="update-category-name"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Category"
            className={`${styles.modalInput} ${error ? styles.modalInputError : ""}`}
            onKeyDown={(e) => {
              if (e.key === "Enter") onUpdate();
            }}
          />
          {error && <p className={styles.modalError}>{error}</p>}
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.modalCancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.modalUpdateBtn} onClick={onUpdate}>
            <span className={styles.modalUpdateIcon}>
              <EditIcon />
            </span>
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
