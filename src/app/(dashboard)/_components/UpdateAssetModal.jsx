"use client";

import { useEffect, useRef } from "react";
import { ASSET_UNITS } from "../_data/assetsData";
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

export function UpdateAssetModal({ open, form, errors, onChange, onClose, onUpdate }) {
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
        aria-labelledby="update-asset-title"
      >
        <div className={styles.modalHeader}>
          <h2 id="update-asset-title" className={styles.modalTitle}>
            Update Asset
          </h2>
          <button type="button" className={styles.modalCloseBtn} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className={styles.modalBody}>
          <label htmlFor="update-asset-name" className={styles.modalLabel}>
            Asset Name
          </label>
          <input
            ref={inputRef}
            id="update-asset-name"
            type="text"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Enter asset name"
            className={`${styles.modalInput} ${errors.name ? styles.modalInputError : ""}`}
          />
          {errors.name && <p className={styles.modalError}>{errors.name}</p>}

          <label htmlFor="update-asset-qty" className={styles.modalLabel}>
            Quantity
          </label>
          <input
            id="update-asset-qty"
            type="number"
            min="0"
            value={form.qty}
            onChange={(e) => onChange("qty", e.target.value)}
            placeholder="Enter quantity"
            className={`${styles.modalInput} ${errors.qty ? styles.modalInputError : ""}`}
          />
          {errors.qty && <p className={styles.modalError}>{errors.qty}</p>}

          <label htmlFor="update-asset-unit" className={styles.modalLabel}>
            Unit
          </label>
          <div className={styles.selectWrap}>
            <select
              id="update-asset-unit"
              value={form.unit}
              onChange={(e) => onChange("unit", e.target.value)}
              className={`${styles.modalSelect} ${errors.unit ? styles.modalInputError : ""}`}
            >
              <option value="">Choose unit</option>
              {ASSET_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          {errors.unit && <p className={styles.modalError}>{errors.unit}</p>}
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
