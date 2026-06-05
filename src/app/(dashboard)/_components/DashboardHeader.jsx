"use client";

import Image from "next/image";
import Link from "next/link";
import { useDashboardNav } from "./DashboardNavContext";
import { useDashboardProfile } from "./DashboardProfileContext";
import { DashboardNotifications } from "./DashboardNotifications";
import { DEFAULT_PROFILE_AVATAR } from "@/lib/default-avatar";
import styles from "./dashboard.module.css";

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DashboardHeader({ title, onNewEvent }) {
  const { toggleMobileNav, mobileNavOpen } = useDashboardNav();
  const { user } = useDashboardProfile();

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          type="button"
          className={styles.menuToggle}
          onClick={toggleMobileNav}
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileNavOpen}
        >
          <MenuIcon />
        </button>
        <h1 className={styles.headerTitle}>{title}</h1>
      </div>
      <div className={styles.headerActions}>
        <DashboardNotifications />
        {onNewEvent ? (
          <button type="button" className={styles.newEventBtn} onClick={onNewEvent}>
            <span className={styles.newEventPlus}>+</span>
            <span className={styles.newEventLabel}>New Event</span>
          </button>
        ) : (
          <Link href="/dashboard/events?create=1" className={styles.newEventBtn} prefetch>
            <span className={styles.newEventPlus}>+</span>
            <span className={styles.newEventLabel}>New Event</span>
          </Link>
        )}
        <div className={styles.profile}>
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>{user.name}</p>
            <p className={styles.profileEmail}>{user.email}</p>
          </div>
          <Image
            src={user.avatar ?? DEFAULT_PROFILE_AVATAR}
            alt={user.name}
            width={42}
            height={52}
            className={styles.profileAvatar}
          />
        </div>
      </div>
    </header>
  );
}
