"use client";

import Image from "next/image";
import Link from "next/link";
import { AgendaSection } from "./AgendaSection";
import { MaterialSection } from "./MaterialSection";
import { RegistrationFormSection } from "./RegistrationFormSection";
import styles from "./dashboard.module.css";

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function formatDetailDate(isoDate) {
  if (!isoDate) return "Date TBD";
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function EventDetailPageContent({ event }) {
  const isOpen = event.status === "Open";

  return (
    <>
      <Link href="/dashboard/events" className={styles.eventDetailBackLink}>
        <BackIcon />
        Back to events
      </Link>

      <section className={styles.eventDetailOverview}>
        <div className={styles.eventDetailBanner}>
          <Image
            src={event.image}
            alt={event.title}
            fill
            className={styles.eventDetailBannerImage}
            sizes="100vw"
            quality={90}
            priority
          />
        </div>
        <div className={styles.eventDetailOverviewBody}>
          <div className={styles.eventDetailTitleRow}>
            <h2 className={styles.eventDetailTitle}>{event.title}</h2>
            <span className={isOpen ? styles.eventStatusOpen : styles.eventStatusClosed}>
              {event.status}
            </span>
          </div>
          <p className={styles.eventDetailDescription}>{event.longDescription}</p>
          <p className={styles.eventDetailLocation}>
            <LocationIcon />
            <span>{event.address}</span>
          </p>
          <span className={styles.eventDetailDateBadge}>
            {formatDetailDate(event.startDate)}
          </span>
        </div>
      </section>

      <RegistrationFormSection
        eventId={event.id}
        initialRegistrationForm={event.registrationForm}
      />

      <MaterialSection eventId={event.id} initialMaterials={event.materials} />

      <AgendaSection eventId={event.id} initialAgenda={event.agenda} />
    </>
  );
}
