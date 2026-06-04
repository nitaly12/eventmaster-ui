import { popularData } from "@/app/(clientView)/_data/popularData";
import { eventDetailExtras } from "@/app/(clientView)/_data/eventDetailData";

const baseDetails = {
  "evt-001": {
    startDate: "2026-08-15",
    address: "Riverside Park, Austin",
    orgName: "EventMaster",
    isOpen: true,
  },
  "evt-002": {
    startDate: "2026-09-10",
    address: "Convention Center, Seattle",
    orgName: "EventMaster",
    isOpen: true,
  },
  "evt-003": {
    startDate: "2026-07-22",
    address: "Malibu Beach, CA",
    orgName: "EventMaster",
    isOpen: false,
  },
  "evt-004": {
    startDate: "2026-12-05",
    address: "Aspen, Colorado",
    orgName: "EventMaster",
    isOpen: true,
  },
  "evt-005": {
    startDate: "2026-10-18",
    address: "Circuit de Monaco",
    orgName: "EventMaster",
    isOpen: false,
  },
  "evt-006": {
    startDate: "2026-11-02",
    address: "Design Hub, Brooklyn",
    orgName: "EventMaster",
    isOpen: true,
  },
};

function getAllEvents() {
  const seen = new Set();
  return popularData.payload.filter((event) => {
    if (!event.eventId || seen.has(event.eventId)) return false;
    seen.add(event.eventId);
    return true;
  });
}

export async function getEventById(id) {
  const base = getAllEvents().find((event) => event.eventId === id);
  if (!base) return null;

  const extras = eventDetailExtras[id] ?? {};
  const meta = baseDetails[id] ?? {};

  return {
    ...base,
    ...meta,
    ...extras,
    longDescription:
      extras.longDescription ?? base.description,
    agenda: extras.agenda ?? [],
  };
}
