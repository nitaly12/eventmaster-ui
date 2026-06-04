const defaultAgenda = [
  {
    id: "agenda-1",
    time: "9:00 AM - 10:00 AM",
    title: "Guest Registration",
    description: null,
    accent: "green",
  },
  {
    id: "agenda-2",
    time: "10:00 AM - 12:00 PM",
    title: "Main Session",
    description: null,
    accent: "purple",
  },
  {
    id: "agenda-3",
    time: "12:00 PM - 1:00 PM",
    title: "Lunch Break",
    description: "Networking lunch with speakers and attendees.",
    accent: "green",
  },
  {
    id: "agenda-4",
    time: "1:00 PM - 3:00 PM",
    title: "Closing Presentation",
    description: "Wrap-up and Q&A with the organizing team.",
    accent: "purple",
  },
];

export const eventDetailExtras = {
  "evt-001": {
    longDescription:
      "Experience a full day of live music, local food vendors, and community celebration. Perfect for families and music lovers looking for an unforgettable outdoor festival.",
    agenda: defaultAgenda,
  },
  "evt-002": {
    eventName: "Design Skill & Tech Session",
    longDescription:
      "Join us for an engaging and insightful session where creativity meets technology! Our Design Skill & Tech Session is tailored for professionals and enthusiasts looking to enhance their design capabilities with cutting-edge technological tools.",
    address: "Street 128, Toul Kok, Phnom Penh",
    startDate: "2023-08-02",
    image: "/images/event-banner-tech.jpg",
    poster: "/images/event-banner-tech.jpg",
    agenda: [
      {
        id: "agenda-1",
        time: "3:00 PM - 4:00 PM",
        title: "Guest Registration",
        description: null,
        accent: "green",
      },
      {
        id: "agenda-2",
        time: "4:00 PM - 5:00 PM",
        title: "Test Rides",
        description: null,
        accent: "purple",
      },
      {
        id: "agenda-3",
        time: "5:00 PM - 7:00 PM",
        title: "Game & Activities",
        description:
          "Fun game & activity booths all around, food & drinks on offer, live DJ, test rides, Vespa club Cambodia signup & Card collection",
        accent: "green",
      },
      {
        id: "agenda-4",
        time: "7:00 PM - 9:00 PM",
        title: "Presentation",
        description:
          "Closing Presentation the event of the year. Speaker: Dr. SOK Sithan",
        accent: "purple",
      },
    ],
  },
  "evt-003": {
    longDescription:
      "An evening by the coast with acoustic performances, bonfire seating, and relaxed social activities for friends and colleagues.",
    agenda: defaultAgenda,
  },
  "evt-004": {
    longDescription:
      "Hit the slopes for timed runs, demo clinics, and après-ski gatherings. All skill levels welcome with equipment partners on site.",
    agenda: defaultAgenda,
  },
  "evt-005": {
    longDescription:
      "A motorsport weekend featuring track sessions, pit lane tours, and fan experiences with professional drivers and teams.",
    agenda: defaultAgenda,
  },
  "evt-006": {
    longDescription:
      "Multi-track creative workshops covering design systems, photography workflows, and storytelling for digital products.",
    agenda: defaultAgenda,
  },
};
