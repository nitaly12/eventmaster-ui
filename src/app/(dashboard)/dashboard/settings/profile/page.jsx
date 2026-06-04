import { DashboardHeader } from "../../../_components/DashboardHeader";
import { UserProfileSection } from "../../../_components/UserProfileSection";
import styles from "../../../_components/dashboard.module.css";

export default function UserProfilePage() {
  return (
    <div className={styles.content}>
      <DashboardHeader title="Account Details" />
      <UserProfileSection />
    </div>
  );
}
