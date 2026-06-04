"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./dashboard.module.css";

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EventCardMenu({ onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className={styles.eventCardMenuWrap} ref={rootRef}>
      <button
        type="button"
        className={styles.eventCardMenuBtn}
        aria-label="Event options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreIcon />
      </button>

      {open && (
        <div className={styles.eventCardMenuDropdown} role="menu">
          <button
            type="button"
            role="menuitem"
            className={styles.eventCardMenuItem}
            onClick={() => {
              onUpdate();
              setOpen(false);
            }}
          >
            <span className={styles.eventCardMenuIconUpdate}>
              <EditIcon />
            </span>
            Update
          </button>
          <div className={styles.eventCardMenuDivider} />
          <button
            type="button"
            role="menuitem"
            className={styles.eventCardMenuItem}
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          >
            <span className={styles.eventCardMenuIconDelete}>
              <TrashIcon />
            </span>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
