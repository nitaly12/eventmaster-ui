"use client";

import { useEffect, useRef, useState } from "react";
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

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
      <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 3v6M9 6l3-3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

function toDatetimeLocal(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function eventToForm(event) {
  return {
    image: null,
    imagePreview: event.image || "",
    eventName: event.title || "",
    category: event.category || "",
    startDateTime: toDatetimeLocal(event.startDate),
    endDateTime: toDatetimeLocal(event.endDate),
    duration: event.duration || "",
    maxAttendee: event.maxAttendee != null ? String(event.maxAttendee) : "",
    address: event.address || "",
    description: event.description || "",
    isPublic: event.isPublic ?? true,
  };
}

const EMPTY_FORM = {
  image: null,
  imagePreview: "",
  eventName: "",
  category: "",
  startDateTime: "",
  endDateTime: "",
  duration: "",
  maxAttendee: "",
  address: "",
  description: "",
  isPublic: true,
};

export function CreateEventModal({ open, categories, editEvent, onClose, onSave, onUpdate }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const isEditing = Boolean(editEvent);

  useEffect(() => {
    if (open) {
      setForm(editEvent ? eventToForm(editEvent) : EMPTY_FORM);
      setErrors({});
    }
  }, [open, editEvent]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleFile = (file) => {
    if (!file?.type.startsWith("image/")) return;
    setForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const validate = () => {
    const next = {};
    if (!form.eventName.trim()) next.eventName = "Event name is required";
    if (!form.category) next.category = "Category is required";
    if (!form.startDateTime) next.startDateTime = "Start date is required";
    if (!form.endDateTime) next.endDateTime = "End date is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const image =
      form.imagePreview?.startsWith("blob:") || !form.imagePreview
        ? "/images/festival.png"
        : form.imagePreview;

    const payload = {
      title: form.eventName.trim(),
      category: form.category,
      startDate: form.startDateTime,
      endDate: form.endDateTime,
      duration: form.duration.trim() || "TBD",
      maxAttendee: form.maxAttendee ? Number(form.maxAttendee) : 0,
      address: form.address.trim(),
      description: form.description.trim(),
      image,
      isPublic: form.isPublic,
    };

    try {
      if (isEditing) {
        await onUpdate(editEvent.id, payload);
      } else {
        await onSave(payload);
      }
      onClose();
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : "Failed to save event",
      });
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="presentation">
      <div
        className={styles.eventModalCard}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={isEditing ? "update-event-title" : "create-event-title"}
      >
        <div className={styles.modalHeader}>
          <h2 id={isEditing ? "update-event-title" : "create-event-title"} className={styles.modalTitle}>
            {isEditing ? "Update Event" : "Create Event"}
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

        <div className={styles.eventModalBody}>
          <div
            className={`${styles.uploadZone} ${dragOver ? styles.uploadZoneActive : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={0}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.uploadInput}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {form.imagePreview ? (
              <img src={form.imagePreview} alt="" className={styles.uploadPreview} />
            ) : (
              <>
                <span className={styles.uploadIconWrap}>
                  <UploadIcon />
                </span>
                <p className={styles.uploadText}>
                  <span className={styles.uploadLink}>Upload</span> or drag and drop files here
                </p>
              </>
            )}
          </div>

          <div className={styles.eventFormGrid}>
            <div className={styles.eventFormField}>
              <label htmlFor="event-name" className={styles.modalLabel}>
                Event Name
              </label>
              <input
                id="event-name"
                type="text"
                value={form.eventName}
                onChange={(e) => setField("eventName", e.target.value)}
                placeholder="Enter event name"
                className={`${styles.modalInput} ${errors.eventName ? styles.modalInputError : ""}`}
              />
              {errors.eventName && <p className={styles.modalError}>{errors.eventName}</p>}
            </div>

            <div className={styles.eventFormField}>
              <label htmlFor="event-category" className={styles.modalLabel}>
                Event Category
              </label>
              <div className={styles.selectWrap}>
                <select
                  id="event-category"
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className={`${styles.modalSelect} ${errors.category ? styles.modalInputError : ""}`}
                >
                  <option value="">Choose category</option>
                  {categories.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && <p className={styles.modalError}>{errors.category}</p>}
            </div>

            <div className={styles.eventFormField}>
              <label htmlFor="start-datetime" className={styles.modalLabel}>
                Start Date Time
              </label>
              <div className={styles.inputWithIcon}>
                <span className={styles.inputIcon}>
                  <CalendarIcon />
                </span>
                <input
                  id="start-datetime"
                  type="datetime-local"
                  value={form.startDateTime}
                  onChange={(e) => setField("startDateTime", e.target.value)}
                  className={`${styles.modalInput} ${styles.modalInputWithIcon} ${errors.startDateTime ? styles.modalInputError : ""}`}
                />
              </div>
              {errors.startDateTime && <p className={styles.modalError}>{errors.startDateTime}</p>}
            </div>

            <div className={styles.eventFormField}>
              <label htmlFor="end-datetime" className={styles.modalLabel}>
                End Date Time
              </label>
              <div className={styles.inputWithIcon}>
                <span className={styles.inputIcon}>
                  <CalendarIcon />
                </span>
                <input
                  id="end-datetime"
                  type="datetime-local"
                  value={form.endDateTime}
                  onChange={(e) => setField("endDateTime", e.target.value)}
                  className={`${styles.modalInput} ${styles.modalInputWithIcon} ${errors.endDateTime ? styles.modalInputError : ""}`}
                />
              </div>
              {errors.endDateTime && <p className={styles.modalError}>{errors.endDateTime}</p>}
            </div>

            <div className={styles.eventFormField}>
              <label htmlFor="duration" className={styles.modalLabel}>
                Duration
              </label>
              <input
                id="duration"
                type="text"
                value={form.duration}
                onChange={(e) => setField("duration", e.target.value)}
                className={styles.modalInput}
              />
            </div>

            <div className={styles.eventFormField}>
              <label htmlFor="max-attendee" className={styles.modalLabel}>
                Maximum Attendee
              </label>
              <input
                id="max-attendee"
                type="number"
                min="1"
                value={form.maxAttendee}
                onChange={(e) => setField("maxAttendee", e.target.value)}
                placeholder="Enter maximum attendee"
                className={styles.modalInput}
              />
            </div>

            <div className={`${styles.eventFormField} ${styles.eventFormFull}`}>
              <label htmlFor="address" className={styles.modalLabel}>
                Address
              </label>
              <input
                id="address"
                type="text"
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                className={styles.modalInput}
              />
            </div>

            <div className={`${styles.eventFormField} ${styles.eventFormFull}`}>
              <label htmlFor="description" className={styles.modalLabel}>
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Enter description..."
                rows={4}
                className={styles.modalTextarea}
              />
            </div>

            <div className={`${styles.eventFormField} ${styles.eventFormFull}`}>
              <div className={styles.visibilityRow}>
                <span className={styles.visibilityLabel}>Create this event as:</span>
                <label className={styles.toggleWrap}>
                  <input
                    type="checkbox"
                    checked={form.isPublic}
                    onChange={(e) => setField("isPublic", e.target.checked)}
                    className={styles.toggleInput}
                  />
                  <span className={styles.toggleTrack}>
                    <span className={styles.toggleThumb} />
                  </span>
                  <span className={styles.toggleText}>Public</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {errors.submit && <p className={styles.modalError}>{errors.submit}</p>}

        <div className={styles.modalFooter}>
          <button type="button" className={styles.modalCancelBtn} onClick={onClose}>
            Cancel
          </button>
          {isEditing ? (
            <button type="button" className={styles.modalUpdateBtn} onClick={handleSave}>
              <span className={styles.modalUpdateIcon}>
                <EditIcon />
              </span>
              Update
            </button>
          ) : (
            <button type="button" className={styles.modalCreateBtn} onClick={handleSave}>
              <span className={styles.modalCreateIcon}>
                <PlusIcon />
              </span>
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
