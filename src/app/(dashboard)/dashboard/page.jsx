import { DashboardHeader } from "../_components/DashboardHeader";
import { OverviewPage } from "../_components/OverviewPage";
import styles from "../_components/dashboard.module.css";

export default function DashboardOverviewPage() {
  return (
    <div className={styles.content}>
      <DashboardHeader title="Overview" />
      <OverviewPage />
    </div>
  );
}
