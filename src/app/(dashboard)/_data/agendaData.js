export const defaultDashboardAgenda = [
  {
    id: "agenda-1",
    time: "3:00 PM - 4:00 PM",
    title: "Guest Registration",
    description: null,
    speaker: null,
    accent: "green",
  },
  {
    id: "agenda-2",
    time: "4:00 PM - 5:00 PM",
    title: "Test Rides",
    description: null,
    speaker: null,
    accent: "purple",
  },
  {
    id: "agenda-3",
    time: "5:00 PM - 7:00 PM",
    title: "Game & Activities",
    description:
      "Fun game & activity booths all around, food & drinks on offer, live DJ, test rides, Vespa club Cambodia signup & Card collection",
    speaker: null,
    accent: "green",
  },
  {
    id: "agenda-4",
    time: "7:00 PM - 9:00 PM",
    title: "Presentation",
    description: "Closing Presentation the event of the year.",
    speaker: "Dr. SOK Sithon",
    accent: "purple",
  },
];

export function getAgendaAccent(index) {
  return index % 2 === 0 ? "green" : "purple";
}
