import { notFound } from "next/navigation";
import { getDashboardEventFromDb } from "@/lib/db/events";
import { DashboardHeader } from "../../../_components/DashboardHeader";
import { EventDetailPageContent } from "../../../_components/EventDetailPageContent";
import styles from "../../../_components/dashboard.module.css";

export default async function DashboardEventDetailPage({ params }) {
  const { id } = await params;
  const event = await getDashboardEventFromDb(id);

  if (!event) {
    notFound();
  }

  return (
    <div className={styles.content}>
      <DashboardHeader title="Event Details" />
      <EventDetailPageContent event={event} />
    </div>
  );
}
