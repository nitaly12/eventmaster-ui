"use client";

import { useState } from "react";
import { getAgendaAccent } from "../_data/agendaData";
import { apiSend } from "@/lib/client-api";
import { notifyCreated, notifyDeleted, notifyUpdated } from "@/lib/toast";
import { CreateAgendaForm } from "./CreateAgendaForm";
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

function AgendaEmptyIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <rect x="18" y="12" width="44" height="56" rx="6" stroke="#D0D5DD" strokeWidth="2" />
      <path d="M28 24h24M28 34h24M28 44h16" stroke="#D0D5DD" strokeWidth="2" strokeLinecap="round" />
      <circle cx="56" cy="56" r="14" fill="#F9F5FF" stroke="#7939EF" strokeWidth="2" />
      <path d="M56 50v8M52 54h8" stroke="#7939EF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AgendaViewItem({ item, index }) {
  const accent = item.accent ?? getAgendaAccent(index);
  const accentClass =
    accent === "green" ? styles.agendaAccentGreen : styles.agendaAccentPurple;
  const hasDetails = Boolean(item.description || item.speaker);

  return (
    <article className={styles.agendaViewItem}>
      <span className={accentClass} aria-hidden />
      <div className={styles.agendaViewBody}>
        <p className={styles.agendaViewTime}>{item.time}</p>
        <h4 className={styles.agendaViewTitle}>{item.title}</h4>
        {hasDetails && (
          <div className={styles.agendaViewDetails}>
            {item.description && (
              <p className={styles.agendaViewDesc}>{item.description}</p>
            )}
            {item.speaker && (
              <p className={styles.agendaViewSpeaker}>Speaker : {item.speaker}</p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function AgendaSection({ eventId, initialAgenda }) {
  const [agenda, setAgenda] = useState(initialAgenda);
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveError, setSaveError] = useState("");

  const persistAgenda = async (items) => {
    await apiSend(`/api/events/${eventId}/agenda`, "PUT", { items });
  };

  const handleSaveAgenda = async (items) => {
    const withAccents = items.map((item, index) => ({
      ...item,
      accent: item.accent ?? getAgendaAccent(index),
    }));
    try {
      setSaveError("");
      await persistAgenda(withAccents);
      const isNewAgenda = agenda.length === 0;
      setAgenda(withAccents);
      setShowAgendaForm(false);
      if (isNewAgenda) {
        notifyCreated("Agenda");
      } else {
        notifyUpdated("Agenda");
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save agenda");
    }
  };

  const confirmDeleteAgenda = async () => {
    try {
      setSaveError("");
      await persistAgenda([]);
      setAgenda([]);
      setShowAgendaForm(false);
      setShowDeleteModal(false);
      notifyDeleted("Agenda");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to delete agenda");
    }
  };

  const hasAgenda = agenda.length > 0;

  return (
    <section className={styles.eventDetailSection}>
      {saveError && (
        <p className={styles.modalError} role="alert">
          {saveError}
        </p>
      )}

      <div className={styles.agendaHeader}>
        <h3 className={styles.eventDetailSectionTitle}>Agenda Management</h3>
        {hasAgenda && !showAgendaForm && (
          <div className={styles.agendaHeaderActions}>
            <button
              type="button"
              className={styles.agendaDeleteBtn}
              onClick={() => setShowDeleteModal(true)}
            >
              <TrashIcon />
              Delete
            </button>
            <button
              type="button"
              className={styles.agendaEditBtn}
              onClick={() => setShowAgendaForm(true)}
            >
              <EditIcon />
              Edit
            </button>
          </div>
        )}
        {!hasAgenda && !showAgendaForm && (
          <button
            type="button"
            className={styles.newCategoryBtn}
            onClick={() => setShowAgendaForm(true)}
          >
            + Create Agenda
          </button>
        )}
      </div>

      {showAgendaForm && (
        <CreateAgendaForm
          initialAgenda={agenda}
          onSave={handleSaveAgenda}
          onCancel={() => setShowAgendaForm(false)}
        />
      )}

      {!showAgendaForm && !hasAgenda && (
        <div className={styles.agendaEmpty}>
          <AgendaEmptyIcon />
          <p className={styles.agendaEmptyTitle}>
            You don&apos;t have an agenda form!
          </p>
          <p className={styles.agendaEmptyText}>
            Please create agenda form for attendees to join event!
          </p>
        </div>
      )}

      {!showAgendaForm && hasAgenda && (
        <div className={styles.agendaList}>
          {agenda.map((item, index) => (
            <AgendaViewItem key={item.id} item={item} index={index} />
          ))}
        </div>
      )}

      <DeleteEventModal
        open={showDeleteModal}
        title="Do you want to remove this agenda?"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteAgenda}
      />
    </section>
  );
}
