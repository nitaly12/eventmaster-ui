"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { initialNotifications } from "../_data/notificationsData";
import styles from "./dashboard.module.css";

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function NotificationAvatar({ name, avatar, avatarBg }) {
  if (avatar) {
    return (
      <span
        className={styles.notificationAvatar}
        style={{ backgroundColor: avatarBg }}
      >
        <Image src={avatar} alt="" width={44} height={44} className={styles.notificationAvatarImg} />
      </span>
    );
  }

  return (
    <span
      className={`${styles.notificationAvatar} ${styles.notificationAvatarFallback}`}
      style={{ backgroundColor: avatarBg }}
      aria-hidden
    >
      {getInitials(name)}
    </span>
  );
}

export function DashboardNotifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const wrapRef = useRef(null);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications],
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const handleItemClick = (id) => {
    markAsRead(id);
    setOpen(false);
  };

  return (
    <div className={styles.bellWrap} ref={wrapRef}>
      <button
        type="button"
        className={`${styles.iconBtn} ${open ? styles.iconBtnActive : ""}`}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
      >
        <BellIcon />
      </button>
      {unreadCount > 0 && (
        <span className={styles.bellDot} aria-hidden>
          <span className={styles.bellDotCount}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        </span>
      )}

      {open && (
        <div className={styles.notificationPanel} role="menu">
          <div className={styles.notificationPanelHeader}>
            <h2 className={styles.notificationPanelTitle}>Notifications</h2>
            <button
              type="button"
              className={styles.notificationMarkAllBtn}
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              Mark as read
            </button>
          </div>

          <ul className={styles.notificationList}>
            {notifications.length === 0 ? (
              <li className={styles.notificationEmpty}>No notifications yet.</li>
            ) : (
              notifications.map((item) => (
                <li key={item.id} className={styles.notificationListItem}>
                  <Link
                    href={item.href}
                    className={`${styles.notificationItem} ${
                      item.unread ? styles.notificationItemUnread : ""
                    }`}
                    role="menuitem"
                    onClick={() => handleItemClick(item.id)}
                  >
                    <NotificationAvatar
                      name={item.name}
                      avatar={item.avatar}
                      avatarBg={item.avatarBg}
                    />
                    <div className={styles.notificationItemMain}>
                      <p className={styles.notificationItemMessage}>
                        <strong>{item.name}</strong> requested access to{" "}
                        <strong>EventMaster</strong>
                      </p>
                      <span className={styles.notificationItemTime}>{item.time}</span>
                    </div>
                    {item.unread && (
                      <span className={styles.notificationUnreadDot} aria-hidden />
                    )}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
