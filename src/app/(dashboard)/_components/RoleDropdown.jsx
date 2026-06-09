"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ROLE_DROPDOWN_OPTIONS, getRoleLabel } from "./roleOptions";
import styles from "./dashboard.module.css";

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AdminRoleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16 4.5l1.2 1.2 2.3-2.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SubAdminRoleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15.5 14.5l2 2M17 13l-2 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserRoleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M19.5 10.5 21 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function RoleOptionIcon({ role }) {
  if (role === "Admin") return <AdminRoleIcon />;
  if (role === "Sub admin") return <SubAdminRoleIcon />;
  return <UserRoleIcon />;
}

function getTriggerClass(role) {
  if (role === "Sub admin") return styles.roleDropdownSubAdmin;
  return styles.roleDropdownUser;
}

export function RoleDropdown({ role, onChange }) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = 220;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openAbove = spaceBelow < menuHeight && rect.top > menuHeight;

    setMenuPosition(
      openAbove
        ? {
            bottom: window.innerHeight - rect.top + 8,
            left: rect.left,
            minWidth: Math.max(rect.width, 196),
          }
        : {
            top: rect.bottom + 8,
            left: rect.left,
            minWidth: Math.max(rect.width, 196),
          },
    );
  }, []);

  useEffect(() => {
    if (!open) return;

    updateMenuPosition();

    const handleClickOutside = (event) => {
      const target = event.target;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    const handleReposition = () => updateMenuPosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, updateMenuPosition]);

  if (role === "Admin") {
    return <span className={styles.roleBadgeAdmin}>Admin</span>;
  }

  const menu =
    open && menuPosition ? (
      <div
        ref={menuRef}
        className={`${styles.roleDropdownMenu} ${styles.roleDropdownMenuPortal}`}
        role="listbox"
        style={{
          top: menuPosition.top,
          bottom: menuPosition.bottom,
          left: menuPosition.left,
          minWidth: menuPosition.minWidth,
        }}
      >
        {ROLE_DROPDOWN_OPTIONS.map((option, index) => (
          <div key={option.value}>
            {index > 0 && <div className={styles.roleDropdownDivider} />}
            <button
              type="button"
              role="option"
              aria-selected={role === option.value}
              className={`${styles.roleDropdownItem} ${
                role === option.value ? styles.roleDropdownItemActive : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <span className={styles.roleDropdownItemIcon}>
                <RoleOptionIcon role={option.value} />
              </span>
              {option.label}
            </button>
          </div>
        ))}
      </div>
    ) : null;

  return (
    <div className={styles.roleDropdown}>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.roleDropdownTrigger} ${getTriggerClass(role)}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={styles.roleDropdownLabel}>{getRoleLabel(role)}</span>
        <ChevronIcon />
      </button>

      {typeof document !== "undefined" && menu
        ? createPortal(menu, document.body)
        : null}
    </div>
  );
}
