import { getOverviewStats } from "@/lib/db/overview";
import { DashboardHeader } from "../_components/DashboardHeader";
import { OverviewPage } from "../_components/OverviewPage";
import styles from "../_components/dashboard.module.css";

export default async function DashboardOverviewPage() {
  let statsCards = [];
  try {
    statsCards = await getOverviewStats();
  } catch {
    statsCards = [];
  }

  return (
    <div className={styles.content}>
      <DashboardHeader title="Overview" />
      <div className={styles.contentBody}>
        <OverviewPage statsCards={statsCards} />
      </div>
    </div>
  );
}
