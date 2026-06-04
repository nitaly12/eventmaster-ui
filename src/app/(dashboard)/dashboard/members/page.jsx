import { DashboardHeader } from "../../_components/DashboardHeader";
import { MembersSection } from "../../_components/MembersSection";
import styles from "../../_components/dashboard.module.css";

export default function MembersPage() {
  return (
    <div className={styles.content}>
      <DashboardHeader title="Members" />
      <MembersSection />
    </div>
  );
}
