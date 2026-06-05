import styles from "./dashboard.module.css";

export function TableRowsSkeleton({ rows = 5 }) {
  return (
    <div className={styles.tableRowsSkeleton} aria-hidden>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className={styles.pageSkeletonRow} />
      ))}
    </div>
  );
}

export function PageContentSkeleton({ rows = 6 }) {
  return (
    <div className={styles.pageSkeleton} aria-hidden>
      <div className={styles.pageSkeletonToolbar}>
        <span className={styles.pageSkeletonBlock} />
        <span className={`${styles.pageSkeletonBlock} ${styles.pageSkeletonBlockShort}`} />
      </div>
      <div className={styles.pageSkeletonCard}>
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className={styles.pageSkeletonRow} />
        ))}
      </div>
    </div>
  );
}
