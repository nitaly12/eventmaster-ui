import type { AgendaItem, Asset, Attendee, Event, EventCategory, Material, Member, Notification, Organization, UserProfile, UserRequest } from "@prisma/client";
import { computeMaterialStats } from "@/app/(dashboard)/_data/materialData";
import { DEFAULT_PROFILE_AVATAR } from "@/lib/default-avatar";

export function mapMember(member: Member) {
  return {
    id: member.displayId,
    name: member.name,
    avatar: member.avatar,
    gender: member.gender,
    email: member.email,
    address: member.address,
    role: member.role,
  };
}

export function mapUserRequest(request: UserRequest) {
  return {
    id: request.displayId,
    name: request.name,
    avatar: request.avatar,
    gender: request.gender,
    email: request.email,
    address: request.address,
    phone: request.phone,
  };
}

export function mapAsset(asset: Asset) {
  return {
    id: asset.id,
    no: asset.no,
    name: asset.name,
    qty: asset.qty,
    unit: asset.unit,
    createdBy: asset.createdBy,
  };
}

export function mapEventCategory(category: EventCategory) {
  return {
    id: category.id,
    no: category.no,
    name: category.name,
    createdAt: category.createdAt,
    createdBy: category.createdBy,
  };
}

export function mapEventListItem(event: Event) {
  return {
    id: event.id,
    title: event.title,
    category: event.category,
    status: event.status,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
    duration: event.duration,
    maxAttendee: event.maxAttendee,
    address: event.address,
    description: event.description,
    image: event.image,
    isPublic: event.isPublic,
  };
}

function parseSupporterIds(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

export function mapMaterial(material: Material) {
  return {
    id: material.id,
    no: material.no,
    name: material.name,
    qty: material.qty,
    unit: material.unit,
    dueDate: material.dueDate,
    handler: material.handler,
    supporterIds: parseSupporterIds(material.supporterIds),
    status: material.status,
    note: material.note,
  };
}

export function mapAgendaItem(item: AgendaItem) {
  return {
    id: item.id,
    time: item.time,
    title: item.title,
    description: item.description,
    speaker: item.speaker,
    accent: item.accent,
  };
}

export function mapAttendee(attendee: Attendee, index: number) {
  return {
    id: String(index + 1),
    name: attendee.name,
    gender: attendee.gender,
    email: attendee.email,
    address: attendee.address,
    phone: attendee.phone,
  };
}

function parseRegistrationForm(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item, index) => ({
      id: typeof item.id === "string" ? item.id : `reg-${index}`,
      fullName: typeof item.fullName === "string" ? item.fullName : "",
      phone: typeof item.phone === "string" ? item.phone : "",
    }));
}

export function mapEventDetail(
  event: Event & {
    agendaItems: AgendaItem[];
    materials: Material[];
    registrationForm?: unknown;
  },
) {
  const materials = event.materials.map(mapMaterial);
  return {
    ...mapEventListItem(event),
    longDescription: event.longDescription ?? event.description,
    agenda: event.agendaItems.map(mapAgendaItem),
    materials,
    materialStats: computeMaterialStats(materials),
    registrationForm: parseRegistrationForm(event.registrationForm),
  };
}

export function mapOrganization(org: Organization) {
  return {
    name: org.name,
    address: org.address,
  };
}

export function mapUserProfile(profile: UserProfile) {
  return {
    name: profile.name,
    gender: profile.gender,
    email: profile.email,
    date: profile.birthDate.toISOString().slice(0, 10),
    phone: profile.phone,
    address: profile.address,
    role: profile.role,
    avatar: profile.avatar,
  };
}

const NOTIFICATION_AVATAR_BG = [
  "#dbeafe",
  "#ede9fe",
  "#dcfce7",
  "#fef9c3",
  "#ffedd5",
  "#e0e7ff",
];

function notificationDisplayName(message: string, title: string) {
  const requested = message.match(/^(.+?)\s+requested\b/i);
  if (requested) return requested[1].trim();

  const wasAdded = message.match(/^(.+?)\s+was\s+/i);
  if (wasAdded) return wasAdded[1].trim();

  return title;
}

export function mapNotification(notification: Notification, index = 0) {
  const name = notificationDisplayName(notification.message, notification.title);
  const avatar =
    /Ly Nita/i.test(name) && notification.href.includes("user-request")
      ? DEFAULT_PROFILE_AVATAR
      : null;

  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    name,
    avatar,
    avatarBg: NOTIFICATION_AVATAR_BG[index % NOTIFICATION_AVATAR_BG.length],
    time: formatRelativeTime(notification.createdAt),
    unread: notification.unread,
    href: notification.href,
  };
}

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return days === 1 ? "Yesterday" : `${days} days ago`;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
  });
}
