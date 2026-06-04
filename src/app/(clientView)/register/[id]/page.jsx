import { RegisterFormComponent } from "../../_components/RegisterFormComponent";
import { getEventById } from "@/services/clientPage/eventDetailService";
import { notFound } from "next/navigation";

export default async function RegisterEventPage({ params }) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <RegisterFormComponent
      eventId={event.eventId}
      eventName={event.eventName}
      isOpen={event.isOpen}
    />
  );
}
