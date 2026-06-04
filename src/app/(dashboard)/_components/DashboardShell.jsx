"use client";

import { DashboardAuthGuard } from "./DashboardAuthGuard";
import { DashboardNavProvider, useDashboardNav } from "./DashboardNavContext";
import { DashboardSidebar } from "./DashboardSidebar";
import styles from "./dashboard.module.css";

function SidebarBackdrop() {
  const { mobileNavOpen, closeMobileNav } = useDashboardNav();

  if (!mobileNavOpen) return null;

  return (
    <button
      type="button"
      className={styles.sidebarBackdrop}
      aria-label="Close menu"
      onClick={closeMobileNav}
    />
  );
}

export function DashboardShell({ children }) {
  return (
    <DashboardNavProvider>
      <div className={styles.shell}>
        <SidebarBackdrop />
        <DashboardSidebar />
        <div className={styles.main}>
          <DashboardAuthGuard>{children}</DashboardAuthGuard>
        </div>
      </div>
    </DashboardNavProvider>
  );
}
