"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

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

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 8v4l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function createEmptyActivity() {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    topic: "",
    startTime: "",
    endTime: "",
    speaker: "",
    description: "",
  };
}

function parseTimeFromRange(timeRange) {
  if (!timeRange) return { startTime: "", endTime: "" };
  const match = timeRange.match(
    /(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i,
  );
  if (!match) return { startTime: "", endTime: "" };
  return {
    startTime: to24Hour(match[1]),
    endTime: to24Hour(match[2]),
  };
}

function to24Hour(time12) {
  const match = time12.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";
  let hour = Number(match[1]);
  const minute = match[2];
  const period = match[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function agendaToActivities(agenda) {
  if (!agenda?.length) return [createEmptyActivity()];
  return agenda.map((item) => {
    const { startTime, endTime } = parseTimeFromRange(item.time);
    return {
      id: item.id,
      topic: item.title || "",
      startTime,
      endTime,
      speaker: item.speaker || "",
      description: item.description || "",
    };
  });
}

function formatTime12(time24) {
  if (!time24) return "";
  const [hourStr, minuteStr] = time24.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minuteStr} ${period}`;
}

export function CreateAgendaForm({ initialAgenda, onSave, onCancel }) {
  const [activities, setActivities] = useState(() => agendaToActivities(initialAgenda));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setActivities(agendaToActivities(initialAgenda));
    setErrors({});
  }, [initialAgenda]);

  const updateActivity = (id, key, value) => {
    setActivities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
    const errorKey = `${id}-${key}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const addActivity = () => {
    setActivities((prev) => [...prev, createEmptyActivity()]);
  };

  const removeActivity = (id) => {
    setActivities((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((item) => item.id !== id);
    });
  };

  const validate = () => {
    const next = {};
    activities.forEach((item) => {
      if (!item.topic.trim()) next[`${item.id}-topic`] = "Topic is required";
      if (!item.startTime) next[`${item.id}-startTime`] = "Start time is required";
      if (!item.endTime) next[`${item.id}-endTime`] = "End time is required";
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const payload = activities.map((item) => ({
      id: item.id.startsWith("act-") ? `agenda-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` : item.id,
      time: `${formatTime12(item.startTime)} - ${formatTime12(item.endTime)}`,
      title: item.topic.trim(),
      description: item.description.trim() || null,
      speaker: item.speaker.trim() || null,
    }));
    onSave(payload);
  };

  return (
    <div className={styles.agendaFormCard}>
      {activities.map((item) => (
        <div key={item.id} className={styles.agendaFormActivity}>
          {activities.length > 1 && (
            <button
              type="button"
              className={styles.agendaFormRemoveBtn}
              onClick={() => removeActivity(item.id)}
              aria-label="Remove activity"
            >
              <CloseIcon />
            </button>
          )}

          <div className={styles.agendaFormField}>
            <label htmlFor={`topic-${item.id}`} className={styles.modalLabel}>
              Topic<span className={styles.requiredMark}>*</span>
            </label>
            <input
              id={`topic-${item.id}`}
              type="text"
              value={item.topic}
              onChange={(e) => updateActivity(item.id, "topic", e.target.value)}
              placeholder="Enter the Topic"
              className={`${styles.modalInput} ${errors[`${item.id}-topic`] ? styles.modalInputError : ""}`}
            />
            {errors[`${item.id}-topic`] && (
              <p className={styles.modalError}>{errors[`${item.id}-topic`]}</p>
            )}
          </div>

          <div className={styles.agendaFormRow3}>
            <div className={styles.agendaFormField}>
              <label htmlFor={`start-${item.id}`} className={styles.modalLabel}>
                Start Time<span className={styles.requiredMark}>*</span>
              </label>
              <div className={styles.inputWithIconRight}>
                <input
                  id={`start-${item.id}`}
                  type="time"
                  value={item.startTime}
                  onChange={(e) => updateActivity(item.id, "startTime", e.target.value)}
                  className={`${styles.modalInput} ${styles.modalInputTime} ${errors[`${item.id}-startTime`] ? styles.modalInputError : ""}`}
                />
                <span className={styles.inputIconRight} aria-hidden>
                  <ClockIcon />
                </span>
              </div>
              {errors[`${item.id}-startTime`] && (
                <p className={styles.modalError}>{errors[`${item.id}-startTime`]}</p>
              )}
            </div>

            <div className={styles.agendaFormField}>
              <label htmlFor={`end-${item.id}`} className={styles.modalLabel}>
                End Time<span className={styles.requiredMark}>*</span>
              </label>
              <div className={styles.inputWithIconRight}>
                <input
                  id={`end-${item.id}`}
                  type="time"
                  value={item.endTime}
                  onChange={(e) => updateActivity(item.id, "endTime", e.target.value)}
                  className={`${styles.modalInput} ${styles.modalInputTime} ${errors[`${item.id}-endTime`] ? styles.modalInputError : ""}`}
                />
                <span className={styles.inputIconRight} aria-hidden>
                  <ClockIcon />
                </span>
              </div>
              {errors[`${item.id}-endTime`] && (
                <p className={styles.modalError}>{errors[`${item.id}-endTime`]}</p>
              )}
            </div>

            <div className={styles.agendaFormField}>
              <label htmlFor={`speaker-${item.id}`} className={styles.modalLabel}>
                Speaker
              </label>
              <input
                id={`speaker-${item.id}`}
                type="text"
                value={item.speaker}
                onChange={(e) => updateActivity(item.id, "speaker", e.target.value)}
                placeholder="Enter the Speaker"
                className={styles.modalInput}
              />
            </div>
          </div>

          <div className={styles.agendaFormField}>
            <label htmlFor={`desc-${item.id}`} className={styles.modalLabel}>
              Description
            </label>
            <textarea
              id={`desc-${item.id}`}
              value={item.description}
              onChange={(e) => updateActivity(item.id, "description", e.target.value)}
              placeholder="Enter description ..."
              className={styles.modalTextarea}
              rows={4}
            />
          </div>
        </div>
      ))}

      <button type="button" className={styles.agendaAddActivityBtn} onClick={addActivity}>
        <span className={styles.agendaAddActivityIcon}>
          <PlusIcon />
        </span>
        Add One more activity
      </button>

      <div className={styles.agendaFormFooter}>
        <button type="button" className={styles.modalCancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className={styles.modalCreateBtn} onClick={handleSave}>
          <span className={styles.modalCreateIcon}>
            <PlusIcon />
          </span>
          Save
        </button>
      </div>
    </div>
  );
}
