import { notFound } from "next/navigation";
import { getDashboardEventFromDb } from "@/lib/db/events";
import { DashboardHeader } from "../../../../_components/DashboardHeader";
import { EventAttendeesSection } from "../../../../_components/EventAttendeesSection";
import styles from "../../../../_components/dashboard.module.css";

export default async function EventAttendeesPage({ params }) {
  const { id } = await params;
  const event = await getDashboardEventFromDb(id);

  if (!event) {
    notFound();
  }

  const displayTitle =
    event.category === "Sports" ? "Sport Event" : event.title;

  return (
    <div className={styles.content}>
      <DashboardHeader title="Events" />
      <EventAttendeesSection eventId={id} eventTitle={displayTitle} />
    </div>
  );
}
