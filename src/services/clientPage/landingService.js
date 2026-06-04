import { popularData } from "@/app/(clientView)/_data/popularData";
import { allCategory as allCategoryData } from "@/app/(clientView)/_data/allCategoryData";

const eventDetails = {
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

function dedupeEvents(events) {
  const seen = new Set();
  return events.filter((event) => {
    const id = event.eventId;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function enrichEvents(events) {
  return dedupeEvents(events).map((event) => ({
    ...event,
    ...eventDetails[event.eventId],
  }));
}

function enrichPayload(data) {
  return {
    ...data,
    payload: enrichEvents(data.payload ?? []),
  };
}

export async function getPopularEvent() {
  return enrichPayload(popularData);
}

export async function getAllCategory() {
  return {
    payload: allCategoryData.payload.map((category) => category.title),
  };
}

export async function getEventByCateName(name) {
  const category = allCategoryData.payload.find((c) => c.title === name);
  return enrichPayload({ payload: category?.payload ?? [] });
}
