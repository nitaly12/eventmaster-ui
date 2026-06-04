import { AssetsSection } from "../../_components/AssetsSection";
import { DashboardHeader } from "../../_components/DashboardHeader";
import styles from "../../_components/dashboard.module.css";

export default function AssetsPage() {
  return (
    <div className={styles.content}>
      <DashboardHeader title="Assets" />
      <AssetsSection />
    </div>
  );
}
