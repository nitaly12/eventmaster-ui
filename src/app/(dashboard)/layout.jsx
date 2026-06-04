import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { DashboardSidebar } from "./_components/DashboardSidebar";
import styles from "./_components/dashboard.module.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard | EventMaster",
  description: "Manage events, members, and categories.",
};

export default function DashboardLayout({ children }) {
  return (
    <div className={jakarta.className}>
      <div className={styles.shell}>
        <DashboardSidebar />
        <div className={styles.main}>{children}</div>
      </div>
    </div>
  );
}
