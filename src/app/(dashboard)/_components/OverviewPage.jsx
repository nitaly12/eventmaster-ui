import { statsCards } from "../_data/overviewData";
import styles from "./dashboard.module.css";
import { OverviewChart } from "./OverviewChart";
import { EventCategorySection } from "./EventCategorySection";

function StatIcon({ type }) {
  const stroke = "#ffffff";
  const icons = {
    calendar: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="4" width="18" height="18" rx="2" stroke={stroke} strokeWidth="1.8" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    published: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="4" width="18" height="18" rx="2" stroke={stroke} strokeWidth="1.8" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        <path d="m9 14 2 2 4-4" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    users: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke={stroke} strokeWidth="1.8" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    member: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="4" stroke={stroke} strokeWidth="1.8" />
        <path d="M4 20v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  };
  return icons[type] ?? icons.calendar;
}

export function OverviewPage() {
  return (
    <>
      <div className={styles.statsGrid}>
        {statsCards.map((card) => (
          <div key={card.id} className={styles.statCard}>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>{card.label}</p>
              <p className={styles.statValue}>{card.value}</p>
            </div>
            <div className={styles.statIcon}>
              <StatIcon type={card.icon} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.middleGrid}>
        <OverviewChart />
        <div className={styles.promoCard}>
          <span className={styles.promoWave1} aria-hidden />
          <span className={styles.promoWave2} aria-hidden />
          <div className={styles.promoInner}>
            <h2 className={styles.promoTitle}>
              Let&apos;s manage your event with us
            </h2>
            <p className={styles.promoText}>
              Create fast, manage fast. Create fast, manage fast. Create fast,
              manage fast.
            </p>
            <button type="button" className={styles.promoBtn}>
              Get Started
            </button>
          </div>
        </div>
      </div>

      <EventCategorySection />
    </>
  );
}
