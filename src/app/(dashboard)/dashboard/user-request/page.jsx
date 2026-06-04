import { DashboardHeader } from "../../_components/DashboardHeader";
import { UserRequestSection } from "../../_components/UserRequestSection";
import styles from "../../_components/dashboard.module.css";

export default function UserRequestPage() {
  return (
    <div className={styles.content}>
      <DashboardHeader title="User Request" />
      <UserRequestSection />
    </div>
  );
}
