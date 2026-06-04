"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuthSession, getDefaultSession } from "@/lib/authSession";
import { DashboardNotifications } from "./DashboardNotifications";
import styles from "./dashboard.module.css";

export function DashboardHeader({ title, onNewEvent }) {
  const [user, setUser] = useState(getDefaultSession());

  useEffect(() => {
    setUser(getAuthSession() ?? getDefaultSession());
  }, []);

  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>{title}</h1>
      <div className={styles.headerActions}>
        <DashboardNotifications />
        {onNewEvent ? (
          <button type="button" className={styles.newEventBtn} onClick={onNewEvent}>
            + New Event
          </button>
        ) : (
          <Link href="/dashboard/events?create=1" className={styles.newEventBtn}>
            + New Event
          </Link>
        )}
        <div className={styles.profile}>
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>{user.name}</p>
            <p className={styles.profileEmail}>{user.email}</p>
          </div>
          <Image
            src={user.avatar ?? "/images/Ellipse 44.png"}
            alt={user.name}
            width={46}
            height={46}
            className={styles.profileAvatar}
          />
        </div>
      </div>
    </header>
  );
}
