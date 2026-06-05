"use client";

import { DashboardAuthGuard } from "./DashboardAuthGuard";
import { DashboardNavProvider, useDashboardNav } from "./DashboardNavContext";
import { DashboardProfileProvider } from "./DashboardProfileContext";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardToast } from "./DashboardToast";
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
      <DashboardAuthGuard>
        <DashboardProfileProvider>
          <div className={styles.shell}>
            <SidebarBackdrop />
            <DashboardSidebar />
            <div className={styles.main}>{children}</div>
            <DashboardToast />
          </div>
        </DashboardProfileProvider>
      </DashboardAuthGuard>
    </DashboardNavProvider>
  );
}
