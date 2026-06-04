import { Suspense } from "react";
import { EventsPageContent } from "../../_components/EventsPageContent";
import styles from "../../_components/dashboard.module.css";

function EventsFallback() {
  return (
    <div className={styles.content}>
      <p className={styles.placeholderText}>Loading events...</p>
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
