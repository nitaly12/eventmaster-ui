import { EventDetailComponent } from "../../_components/EventDetailComponent";
import { getEventById } from "@/services/clientPage/eventDetailService";
import { notFound } from "next/navigation";

export default async function EventDetailPage({ params }) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return <EventDetailComponent event={event} />;
}
