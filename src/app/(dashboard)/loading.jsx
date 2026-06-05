import { DashboardHeader } from "./_components/DashboardHeader";
import { PageContentSkeleton } from "./_components/PageContentSkeleton";
import styles from "./_components/dashboard.module.css";

export default function DashboardLoading() {
  return (
    <div className={styles.content}>
      <DashboardHeader title="Loading" />
      <PageContentSkeleton />
    </div>
  );
}
