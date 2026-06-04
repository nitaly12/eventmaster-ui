export const MATERIAL_STATUSES = ["Pending", "Done", "On Going", "Issue"];

export const MATERIAL_UNITS = ["Boxes", "Bottle", "Cans", "Pieces", "Sets"];

export const MATERIAL_HANDLERS = ["Nita", "Davin", "Thomas Brown", "Sarah Johnson"];

export const MATERIAL_SUPPORTERS = [
  { id: "001", name: "Thomas Brown", avatar: "/images/Ellipse 44.png" },
  { id: "002", name: "Sarah Johnson", avatar: null },
  { id: "003", name: "Michael Chen", avatar: null },
  { id: "004", name: "Emily Davis", avatar: null },
  { id: "005", name: "James Wilson", avatar: null },
];

export const defaultEventMaterials = [
  {
    id: "mat-1",
    no: 1,
    name: "Coca",
    qty: 3,
    unit: "Boxes",
    dueDate: "2024-05-09",
    handler: "Nita",
    supporterIds: ["001", "002"],
    status: "Pending",
    note: "",
  },
  {
    id: "mat-2",
    no: 2,
    name: "Sprite",
    qty: 5,
    unit: "Bottle",
    dueDate: "2024-05-10",
    handler: "Davin",
    supporterIds: ["001", "002", "003"],
    status: "Done",
    note: "",
  },
  {
    id: "mat-3",
    no: 3,
    name: "Fanta",
    qty: 2,
    unit: "Cans",
    dueDate: "2024-05-11",
    handler: "Nita",
    supporterIds: ["002", "004"],
    status: "On Going",
    note: "",
  },
  {
    id: "mat-4",
    no: 4,
    name: "Pepsi",
    qty: 2,
    unit: "Boxes",
    dueDate: "2024-05-14",
    handler: "Davin",
    supporterIds: ["003"],
    status: "Issue",
    note: "",
  },
  {
    id: "mat-5",
    no: 5,
    name: "7Up",
    qty: 1,
    unit: "Bottle",
    dueDate: "2024-05-13",
    handler: "Nita",
    supporterIds: ["001", "005"],
    status: "Done",
    note: "",
  },
  {
    id: "mat-6",
    no: 6,
    name: "Angkor",
    qty: 10,
    unit: "Cans",
    dueDate: "2024-05-15",
    handler: "Davin",
    supporterIds: ["002", "003", "004"],
    status: "Pending",
    note: "Life is made of...",
  },
];

export function computeMaterialStats(materials) {
  const stats = { total: materials.length, pending: 0, onGoing: 0, done: 0, issue: 0 };
  materials.forEach((item) => {
    if (item.status === "Pending") stats.pending += 1;
    else if (item.status === "On Going") stats.onGoing += 1;
    else if (item.status === "Done") stats.done += 1;
    else if (item.status === "Issue") stats.issue += 1;
  });
  return stats;
}

export function renumberMaterials(materials) {
  return materials.map((item, index) => ({ ...item, no: index + 1 }));
}
