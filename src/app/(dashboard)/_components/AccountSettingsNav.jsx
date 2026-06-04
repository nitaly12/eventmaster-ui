"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./dashboard.module.css";

const SETTINGS_LINKS = [
  { href: "/dashboard/settings/organization", label: "Organization Profile" },
  { href: "/dashboard/settings/profile", label: "User Profile" },
];

function ChevronIcon({ expanded }) {
  return (
    <svg
      className={`${styles.accountSettingsNavChevron} ${expanded ? styles.accountSettingsNavChevronOpen : ""}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AccountSettingsNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const active =
    SETTINGS_LINKS.find((item) => pathname === item.href) ?? SETTINGS_LINKS[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className={styles.accountSettingsNav} ref={rootRef}>
      <button
        type="button"
        className={styles.accountSettingsNavTrigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{active.label}</span>
        <ChevronIcon expanded={open} />
      </button>

      {open && (
        <div className={styles.accountSettingsNavMenu} role="listbox">
          {SETTINGS_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                role="option"
                aria-selected={isActive}
                className={`${styles.accountSettingsNavItem} ${
                  isActive ? styles.accountSettingsNavItemActive : ""
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
