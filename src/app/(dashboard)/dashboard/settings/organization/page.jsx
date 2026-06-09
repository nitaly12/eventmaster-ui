import { DashboardHeader } from "../../../_components/DashboardHeader";
import { OrganizationProfileSection } from "../../../_components/OrganizationProfileSection";
import styles from "../../../_components/dashboard.module.css";

export default function OrganizationProfilePage() {
  return (
    <div className={styles.content}>
      <DashboardHeader title="Account Details" />
      <div className={styles.contentBody}>
        <OrganizationProfileSection />
      </div>
    </div>
  );
}
