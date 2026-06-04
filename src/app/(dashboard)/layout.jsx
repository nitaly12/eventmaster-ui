import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { DashboardShell } from "./_components/DashboardShell";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard | EventMaster",
  description: "Manage events, members, and categories.",
};

export default function DashboardLayout({ children }) {
  return (
    <div className={jakarta.className}>
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
