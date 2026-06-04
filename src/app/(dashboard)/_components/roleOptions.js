export const ROLE_DROPDOWN_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Sub admin", label: "Sub Admin" },
  { value: "User", label: "User" },
];

export function getRoleLabel(role) {
  if (role === "Sub admin") return "Sub Admin";
  return role;
}
