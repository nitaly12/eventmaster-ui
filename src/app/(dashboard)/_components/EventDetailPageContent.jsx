"use client";

import Image from "next/image";
import Link from "next/link";
import { AgendaSection } from "./AgendaSection";
import { MaterialSection } from "./MaterialSection";
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

      <section className={styles.eventDetailSection}>
        <h3 className={styles.eventDetailSectionTitle}>Registration Form</h3>

        <div className={styles.registrationBlock}>
          <h4 className={styles.registrationSubtitle}>Contact Information</h4>
          <div className={styles.registrationGrid}>
            <div className={styles.registrationField}>
              <label>
                Full Name<span className={styles.requiredMark}>*</span>
              </label>
              <input type="text" placeholder="Enter full name" disabled />
            </div>
            <div className={styles.registrationField}>
              <label>
                Gender<span className={styles.requiredMark}>*</span>
              </label>
              <select disabled defaultValue="">
                <option value="">Choosing gender</option>
              </select>
            </div>
            <div className={styles.registrationField}>
              <label>
                Phone Number<span className={styles.requiredMark}>*</span>
              </label>
              <input type="text" placeholder="Enter phone number" disabled />
            </div>
            <div className={styles.registrationField}>
              <label>
                Email<span className={styles.requiredMark}>*</span>
              </label>
              <input type="email" placeholder="Enter email" disabled />
            </div>
          </div>
        </div>

        <div className={styles.registrationBlock}>
          <h4 className={styles.registrationSubtitle}>Affiliation</h4>
          <div className={styles.registrationGrid}>
            <div className={styles.registrationField}>
              <label>
                Company Name<span className={styles.requiredMark}>*</span>
              </label>
              <input type="text" placeholder="Enter company name" disabled />
            </div>
            <div className={styles.registrationField}>
              <label>
                Title/Position <span className={styles.optionalMark}>(optional)</span>
              </label>
              <input type="text" placeholder="Enter title/position" disabled />
            </div>
          </div>
        </div>
      </section>

      <MaterialSection initialMaterials={event.materials} />

      <AgendaSection initialAgenda={event.agenda} />
    </>
  );
}
