"use client";

import styles from "./_components/dashboard.module.css";

export default function DashboardTemplate({ children }) {
  return <div className={styles.pageTransition}>{children}</div>;
}
