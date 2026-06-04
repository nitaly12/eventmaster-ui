"use client";

import Image from "next/image";
import { useEffect } from "react";
import styles from "./dashboard.module.css";

const DELETE_ILLUSTRATION = "/images/image 231.png";

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

export function DeleteEventModal({ open, title = "Do you want to remove this event?", onClose, onConfirm }) {
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
        className={styles.deleteModalCard}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-event-title"
      >
        <button
          type="button"
          className={styles.deleteModalCloseBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className={styles.deleteModalIllustration}>
          <Image
            src={DELETE_ILLUSTRATION}
            alt=""
            width={220}
            height={200}
            className={styles.deleteModalImage}
            priority
          />
        </div>

        <h2 id="delete-event-title" className={styles.deleteModalTitle}>
          {title}
        </h2>

        <div className={styles.deleteModalActions}>
          <button type="button" className={styles.deleteYesBtn} onClick={onConfirm}>
            Yes
          </button>
          <button type="button" className={styles.deleteNoBtn} onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
