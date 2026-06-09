import Link from "next/link";
import { DashboardHeader } from "../../../_components/DashboardHeader";
import styles from "../../../_components/dashboard.module.css";

export default function EventDetailNotFound() {
  return (
    <div className={styles.content}>
      <DashboardHeader title="Event Details" />
      <div className={styles.contentBody}>
        <div className={styles.placeholderPage}>
          <h2 className={styles.placeholderTitle}>Event not found</h2>
          <p className={styles.placeholderText}>
            This event may have been removed or the link is incorrect.
          </p>
          <Link href="/dashboard/events" className={styles.eventViewDetailBtn}>
            Back to events
          </Link>
        </div>
      </div>
    </div>
  );
}
