import { dashboardEvents } from "./eventsData";
import { defaultDashboardAgenda } from "./agendaData";
import { defaultEventMaterials } from "./materialData";

export const defaultMaterialStats = {
  total: 40,
  pending: 20,
  onGoing: 10,
  done: 8,
  issue: 2,
};

export const eventDetailExtras = {
  "evt-d1": {
    title: "Design Skill & Tech Session",
    address: "Street 128, Toul Kork, Phnom Penh",
    startDate: "2023-08-02T09:00:00",
    image: "/images/event-banner-tech.jpg",
    longDescription:
      "Join us for an engaging and insightful session where creativity meets technology! Our Design Skill & Tech Session is tailored for professionals and enthusiasts looking to enhance their design capabilities with cutting-edge technological tools.",
    agenda: defaultDashboardAgenda,
    materials: defaultEventMaterials,
  },
};

export function getDashboardEvent(id) {
  const event = dashboardEvents.find((item) => item.id === id);
  if (!event) return null;

  const extras = eventDetailExtras[id] ?? {};
  return {
    ...event,
    ...extras,
    longDescription: extras.longDescription ?? event.description,
    materialStats: extras.materialStats ?? defaultMaterialStats,
    materials: extras.materials ?? [],
    agenda: extras.agenda ?? [],
  };
}
