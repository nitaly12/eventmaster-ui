export const ATTENDEES_PAGE_SIZE = 7;

const seedAttendees = [
  {
    id: "1",
    name: "Morng many",
    gender: "Female",
    email: "many34@gmail.com",
    address: "Phnom Penh",
    phone: "092356789",
  },
  {
    id: "2",
    name: "Serey both",
    gender: "Male",
    email: "both@gmail.com",
    address: "Kampong Cham",
    phone: "0974567863",
  },
  {
    id: "3",
    name: "Chantha lim",
    gender: "Female",
    email: "lim.chantha@gmail.com",
    address: "Siem Reap",
    phone: "0887654321",
  },
  {
    id: "4",
    name: "Dara pich",
    gender: "Male",
    email: "dara.pich@gmail.com",
    address: "Battambang",
    phone: "0961234567",
  },
  {
    id: "5",
    name: "Sophea keo",
    gender: "Female",
    email: "sophea.k@gmail.com",
    address: "Phnom Penh",
    phone: "0934567890",
  },
  {
    id: "6",
    name: "Vuthy san",
    gender: "Male",
    email: "vuthy.san@gmail.com",
    address: "Kandal",
    phone: "0987654321",
  },
  {
    id: "7",
    name: "Rina chea",
    gender: "Female",
    email: "rina.chea@gmail.com",
    address: "Preah Sihanouk",
    phone: "0912345678",
  },
];

const extraNames = [
  ["Bopha sun", "Female", "bopha.sun@gmail.com", "Takeo", "0901122334"],
  ["Heng mao", "Male", "heng.mao@gmail.com", "Kampot", "0978877665"],
  ["Nary te", "Female", "nary.te@gmail.com", "Phnom Penh", "0923344556"],
  ["Pisach ly", "Male", "pisach.ly@gmail.com", "Pursat", "0967788990"],
  ["Kunthea om", "Female", "kunthea.om@gmail.com", "Kampong Speu", "0889900112"],
  ["Sokha penh", "Male", "sokha.penh@gmail.com", "Phnom Penh", "0932211445"],
  ["Malis hor", "Female", "malis.hor@gmail.com", "Tbong Khmum", "0915566778"],
];

function buildAttendeesList() {
  const list = [...seedAttendees];
  let id = 8;

  while (list.length < 70) {
    const template = extraNames[(id - 8) % extraNames.length];
    list.push({
      id: String(id),
      name: template[0],
      gender: template[1],
      email: template[2],
      address: template[3],
      phone: template[4],
    });
    id += 1;
  }

  return list;
}

const attendeesByEvent = {
  "evt-d6": buildAttendeesList(),
};

export function getEventAttendees(eventId) {
  return attendeesByEvent[eventId] ?? buildAttendeesList();
}
