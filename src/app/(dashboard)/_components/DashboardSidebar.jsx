"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAuthSession } from "@/lib/authSession";
import { useDashboardNav } from "./DashboardNavContext";
import { LogoutModal } from "./LogoutModal";
import styles from "./dashboard.module.css";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "overview" },
  { href: "/dashboard/members", label: "Members", icon: "members" },
  { href: "/dashboard/assets", label: "Assets", icon: "assets" },
  { href: "/dashboard/events", label: "Events", icon: "events" },
  { href: "/dashboard/user-request", label: "User Request", icon: "request" },
];

const settingsSubItems = [
  { href: "/dashboard/settings/organization", label: "Organization Profile" },
  { href: "/dashboard/settings/profile", label: "User Profile" },
];

function NavIcon({ name }) {
  const stroke = "currentColor";
  const icons = {
    overview: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.8" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.8" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.8" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.8" />
      </svg>
    ),
    members: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke={stroke} strokeWidth="1.8" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    assets: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke={stroke} strokeWidth="1.8" />
      </svg>
    ),
    events: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="4" width="18" height="18" rx="2" stroke={stroke} strokeWidth="1.8" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    request: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    settings: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth="1.8" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={stroke} strokeWidth="1.8" />
      </svg>
    ),
  };
  return <span className={styles.navIcon}>{icons[name]}</span>;
}

function ChevronIcon({ expanded }) {
  return (
    <svg
      className={`${styles.navChevron} ${expanded ? styles.navChevronExpanded : ""}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mobileNavOpen, closeMobileNav } = useDashboardNav();
  const isSettingsRoute = pathname.startsWith("/dashboard/settings");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    const syncSettingsOpen = () => {
      if (!isSettingsRoute) {
        setSettingsOpen(false);
        return;
      }
      setSettingsOpen(window.innerWidth > 768);
    };

    syncSettingsOpen();
    window.addEventListener("resize", syncSettingsOpen);
    return () => window.removeEventListener("resize", syncSettingsOpen);
  }, [isSettingsRoute]);

  useEffect(() => {
    if (!mobileNavOpen) {
      setSettingsOpen(false);
    } else if (isSettingsRoute && window.innerWidth <= 768) {
      setSettingsOpen(true);
    }
  }, [mobileNavOpen, isSettingsRoute]);

  const closeNav = () => closeMobileNav();

  return (
    <aside
      className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarMobileOpen : ""}`}
    >
      <Link
        href="/dashboard"
        className={styles.logoWrap}
        aria-label="EventMaster home"
        onClick={closeNav}
      >
        <span className={styles.logoCircle}>E</span>
      </Link>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
              onClick={closeNav}
            >
              <NavIcon name={item.icon} />
              <span className={styles.navLinkLabel}>{item.label}</span>
            </Link>
          );
        })}

        <div className={styles.navSettingsGroup}>
          <button
            type="button"
            className={`${styles.navLink} ${isSettingsRoute ? styles.navLinkActive : ""}`}
            onClick={() => {
              if (isSettingsRoute) {
                setSettingsOpen((prev) => !prev);
              } else {
                router.push("/dashboard/settings/organization");
                closeNav();
              }
            }}
            aria-expanded={settingsOpen}
          >
            <NavIcon name="settings" />
            <span className={styles.navLinkLabel}>Account Setting</span>
            <ChevronIcon expanded={settingsOpen} />
          </button>

          {settingsOpen && (
            <div className={styles.navSubMenu}>
              {settingsSubItems.map((item) => {
                const isSubActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navSubLink} ${isSubActive ? styles.navSubLinkActive : ""}`}
                    onClick={closeNav}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <div className={styles.navFooter}>
        <button
          type="button"
          className={styles.logoutBtn}
          onClick={() => setLogoutOpen(true)}
        >
          <span className={styles.navIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className={styles.navLinkLabel}>Logout</span>
        </button>
      </div>

      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => {
          clearAuthSession();
          setLogoutOpen(false);
          router.push("/login");
        }}
      />
    </aside>
  );
}
