import { Suspense } from "react";
import { DashboardHeader } from "../../_components/DashboardHeader";
import { EventsPageContent } from "../../_components/EventsPageContent";
import styles from "../../_components/dashboard.module.css";

function EventsFallback() {
  return (
    <div className={styles.content}>
      <DashboardHeader title="Events" />
      <div className={styles.contentBody}>
        <p className={styles.placeholderText}>Loading events...</p>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsFallback />}>
      <EventsPageContent />
    </Suspense>
  );
}
