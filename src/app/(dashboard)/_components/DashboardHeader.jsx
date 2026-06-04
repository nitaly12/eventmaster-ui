import Image from "next/image";
import Link from "next/link";
import styles from "./dashboard.module.css";

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DashboardHeader({ title, onNewEvent }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>{title}</h1>
      <div className={styles.headerActions}>
        <div className={styles.bellWrap}>
          <button type="button" className={styles.iconBtn} aria-label="Notifications">
            <BellIcon />
          </button>
          <span className={styles.bellDot} aria-hidden />
        </div>
        {onNewEvent ? (
          <button type="button" className={styles.newEventBtn} onClick={onNewEvent}>
            + New Event
          </button>
        ) : (
          <Link href="/dashboard/events?create=1" className={styles.newEventBtn}>
            + New Event
          </Link>
        )}
        <div className={styles.profile}>
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>Thomas Brown</p>
            <p className={styles.profileEmail}>ThomasNikola@gmail.com</p>
          </div>
          <Image
            src="/images/Ellipse 44.png"
            alt="Thomas Brown"
            width={46}
            height={46}
            className={styles.profileAvatar}
          />
        </div>
      </div>
    </header>
  );
}
