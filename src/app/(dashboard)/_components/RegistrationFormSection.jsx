"use client";

import { useEffect, useState } from "react";
import { apiSend } from "@/lib/client-api";
import { notifyDeleted, notifyUpdated } from "@/lib/toast";
import { DeleteEventModal } from "./DeleteEventModal";
import styles from "./dashboard.module.css";

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function ContactInfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="3" width="12" height="16" rx="2" fill="#FEE4E2" stroke="#F97066" strokeWidth="1.2" />
      <rect x="8" y="6" width="12" height="16" rx="2" fill="#E0EAFF" stroke="#6172F3" strokeWidth="1.2" />
      <rect x="6" y="8" width="12" height="14" rx="2" fill="#FEF0C7" stroke="#F79009" strokeWidth="1.2" />
    </svg>
  );
}

function createActivity() {
  return {
    id: `reg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    fullName: "",
    phone: "",
  };
}

function normalizeActivities(initial) {
  if (!Array.isArray(initial) || initial.length === 0) {
    return [createActivity()];
  }
  return initial.map((item, index) => ({
    id: item.id ?? `reg-${index}`,
    fullName: item.fullName ?? "",
    phone: item.phone ?? "",
  }));
}

export function RegistrationFormSection({ eventId, initialRegistrationForm = [] }) {
  const [activities, setActivities] = useState(() =>
    normalizeActivities(initialRegistrationForm),
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [savedHint, setSavedHint] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setActivities(normalizeActivities(initialRegistrationForm));
  }, [initialRegistrationForm]);

  const persistRegistration = async (nextActivities) => {
    await apiSend(`/api/events/${eventId}/registration`, "PUT", {
      activities: nextActivities,
    });
  };

  const updateActivity = (id, field, value) => {
    setActivities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
    setSavedHint(false);
  };

  const addActivity = () => {
    setActivities((prev) => [...prev, createActivity()]);
    setSavedHint(false);
  };

  const removeActivity = (id) => {
    setActivities((prev) => {
      if (prev.length <= 1) return [createActivity()];
      return prev.filter((item) => item.id !== id);
    });
    setSavedHint(false);
  };

  const handleUpdate = async () => {
    try {
      setSaveError("");
      await persistRegistration(activities);
      setSavedHint(true);
      notifyUpdated("Registration form");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Failed to save registration form",
      );
    }
  };

  const confirmDelete = async () => {
    const empty = [createActivity()];
    try {
      setSaveError("");
      await persistRegistration(empty);
      setActivities(empty);
      setSavedHint(false);
      setShowDeleteModal(false);
      notifyDeleted("Registration form");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Failed to clear registration form",
      );
    }
  };

  return (
    <section className={styles.eventDetailSection}>
      <div className={styles.registrationHeader}>
        <h3 className={styles.registrationFormTitle}>Registration form</h3>
        <div className={styles.agendaHeaderActions}>
          <button
            type="button"
            className={styles.agendaDeleteBtn}
            onClick={() => setShowDeleteModal(true)}
          >
            <TrashIcon />
            Delete
          </button>
          <button type="button" className={styles.agendaEditBtn} onClick={handleUpdate}>
            <EditIcon />
            {savedHint ? "Saved" : "Update"}
          </button>
        </div>
      </div>

      {saveError && (
        <p className={styles.modalError} role="alert">
          {saveError}
        </p>
      )}

      <div className={styles.registrationFormStack}>
        {activities.map((activity, index) => (
          <div key={activity.id} className={styles.registrationCard}>
            <div className={styles.registrationSubtitleRow}>
              <ContactInfoIcon />
              <h4 className={styles.registrationSubtitle}>Contact Information</h4>
              {activities.length > 1 && (
                <button
                  type="button"
                  className={styles.registrationRemoveBlockBtn}
                  onClick={() => removeActivity(activity.id)}
                  aria-label={`Remove activity ${index + 1}`}
                >
                  Remove
                </button>
              )}
            </div>

            <div className={styles.registrationGrid}>
              <div className={styles.registrationField}>
                <label htmlFor={`reg-name-${activity.id}`}>
                  Full Name<span className={styles.requiredMark}>*</span>
                </label>
                <input
                  id={`reg-name-${activity.id}`}
                  type="text"
                  value={activity.fullName}
                  onChange={(e) => updateActivity(activity.id, "fullName", e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              <div className={styles.registrationField}>
                <label htmlFor={`reg-phone-${activity.id}`}>
                  Phone Number<span className={styles.requiredMark}>*</span>
                </label>
                <input
                  id={`reg-phone-${activity.id}`}
                  type="tel"
                  value={activity.phone}
                  onChange={(e) => updateActivity(activity.id, "phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>
        ))}

        <button type="button" className={styles.agendaAddActivityBtn} onClick={addActivity}>
          <span className={styles.agendaAddActivityIcon}>
            <PlusIcon />
          </span>
          Add One more activity
        </button>
      </div>

      <DeleteEventModal
        open={showDeleteModal}
        title="Are you sure you want to clear the registration form?"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
