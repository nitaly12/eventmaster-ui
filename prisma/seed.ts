import { PrismaClient } from "@prisma/client";
import { assets } from "../src/app/(dashboard)/_data/assetsData.js";
import { defaultDashboardAgenda } from "../src/app/(dashboard)/_data/agendaData.js";
import { dashboardEvents } from "../src/app/(dashboard)/_data/eventsData.js";
import { defaultEventMaterials } from "../src/app/(dashboard)/_data/materialData.js";
import { members } from "../src/app/(dashboard)/_data/membersData.js";
import {
  defaultOrganizationProfile,
  defaultUserProfile,
} from "../src/app/(dashboard)/_data/organizationSettingsData.js";
import { eventCategories } from "../src/app/(dashboard)/_data/overviewData.js";
import { userRequests } from "../src/app/(dashboard)/_data/userRequestData.js";

const prisma = new PrismaClient();

const evtD1Extras = {
  title: "Design Skill & Tech Session",
  address: "Street 128, Toul Kork, Phnom Penh",
  startDate: "2023-08-02T09:00:00",
  image: "/images/event-banner-tech.jpg",
  longDescription:
    "Join us for an engaging and insightful session where creativity meets technology! Our Design Skill & Tech Session is tailored for professionals and enthusiasts looking to enhance their design capabilities with cutting-edge technological tools.",
};

async function main() {
  await prisma.notification.deleteMany();
  await prisma.attendee.deleteMany();
  await prisma.material.deleteMany();
  await prisma.agendaItem.deleteMany();
  await prisma.event.deleteMany();
  await prisma.eventCategory.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.userRequest.deleteMany();
  await prisma.member.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.organization.deleteMany();

  await prisma.organization.create({
    data: {
      id: "default",
      name: defaultOrganizationProfile.name,
      address: defaultOrganizationProfile.address,
      logoUrl: "/images/image_237-removebg 1.png",
    },
  });

  await prisma.userProfile.create({
    data: {
      id: "default",
      name: defaultUserProfile.name,
      gender: defaultUserProfile.gender,
      email: defaultUserProfile.email,
      birthDate: new Date(defaultUserProfile.date),
      phone: defaultUserProfile.phone,
      address: defaultUserProfile.address,
      role: defaultUserProfile.role,
      avatar: defaultUserProfile.avatar,
    },
  });

  await prisma.member.createMany({
    data: members.map((member) => ({
      displayId: member.id,
      name: member.name,
      avatar: member.avatar,
      gender: member.gender,
      email: member.email,
      address: member.address,
      role: member.role,
    })),
  });

  await prisma.userRequest.createMany({
    data: userRequests.map((request) => ({
      displayId: request.id,
      name: request.name,
      avatar: request.avatar,
      gender: request.gender,
      email: request.email,
      address: request.address,
      phone: request.phone,
      status: "pending",
    })),
  });

  await prisma.asset.createMany({
    data: assets.map((asset) => ({
      no: asset.no,
      name: asset.name,
      qty: asset.qty,
      unit: asset.unit,
      createdBy: asset.createdBy,
    })),
  });

  await prisma.eventCategory.createMany({
    data: eventCategories.map((category) => ({
      id: category.id,
      no: category.no,
      name: category.name,
      createdAt: category.createdAt,
      createdBy: category.createdBy,
    })),
  });

  for (const event of dashboardEvents) {
    const extras = event.id === "evt-d1" ? evtD1Extras : null;
    await prisma.event.create({
      data: {
        id: event.id,
        title: extras?.title ?? event.title,
        category: event.category,
        status: event.status,
        startDate: new Date(extras?.startDate ?? event.startDate),
        endDate: new Date(event.endDate),
        duration: event.duration,
        maxAttendee: event.maxAttendee,
        address: extras?.address ?? event.address,
        description: event.description,
        longDescription: extras?.longDescription ?? event.description,
        image: extras?.image ?? event.image,
        isPublic: event.isPublic,
        agendaItems:
          event.id === "evt-d1"
            ? {
                create: defaultDashboardAgenda.map((item, index) => ({
                  sortOrder: index,
                  time: item.time,
                  title: item.title,
                  description: item.description,
                  speaker: item.speaker,
                  accent: item.accent,
                })),
              }
            : undefined,
        materials:
          event.id === "evt-d1"
            ? {
                create: defaultEventMaterials.map((material) => ({
                  no: material.no,
                  name: material.name,
                  qty: material.qty,
                  unit: material.unit,
                  dueDate: material.dueDate,
                  handler: material.handler,
                  supporterIds: material.supporterIds,
                  status: material.status,
                  note: material.note,
                })),
              }
            : undefined,
      },
    });
  }

  const attendeeNames = [
    ["Morng many", "Female", "many34@gmail.com", "Phnom Penh", "092356789"],
    ["Serey both", "Male", "both@gmail.com", "Kampong Cham", "0974567863"],
    ["Chantha lim", "Female", "lim.chantha@gmail.com", "Siem Reap", "0887654321"],
    ["Dara pich", "Male", "dara.pich@gmail.com", "Battambang", "0961234567"],
    ["Sophea keo", "Female", "sophea.k@gmail.com", "Phnom Penh", "0934567890"],
  ] as const;

  const attendeeRows = Array.from({ length: 70 }, (_, index) => {
    const template = attendeeNames[index % attendeeNames.length];
    return {
      eventId: "evt-d6",
      name: template[0],
      gender: template[1],
      email: template[2],
      address: template[3],
      phone: template[4],
    };
  });

  await prisma.attendee.createMany({ data: attendeeRows });

  await prisma.notification.createMany({
    data: [
      {
        title: "New user request",
        message: "Ly Nita requested access to EventMaster.",
        href: "/dashboard/user-request",
        unread: true,
        sortOrder: 1,
      },
      {
        title: "Event published",
        message: "Tech Conference 2024 is now live for attendees.",
        href: "/dashboard/events",
        unread: true,
        sortOrder: 2,
      },
      {
        title: "Material update",
        message: "Projector setup status changed to Pending.",
        href: "/dashboard/events/evt-d1",
        unread: true,
        sortOrder: 3,
      },
      {
        title: "Member joined",
        message: "Sarah Johnson was added as a User.",
        href: "/dashboard/members",
        unread: false,
        sortOrder: 4,
      },
      {
        title: "Agenda reminder",
        message: "Opening ceremony activity starts in 2 days.",
        href: "/dashboard/events/evt-d1",
        unread: false,
        sortOrder: 5,
      },
      {
        title: "New user request",
        message: "Morng many requested access to EventMaster.",
        href: "/dashboard/user-request",
        unread: false,
        sortOrder: 6,
      },
    ],
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
