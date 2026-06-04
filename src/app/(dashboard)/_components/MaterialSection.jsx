"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MATERIAL_HANDLERS,
  MATERIAL_STATUSES,
  MATERIAL_SUPPORTERS,
  MATERIAL_UNITS,
  computeMaterialStats,
  renumberMaterials,
} from "../_data/materialData";
import styles from "./dashboard.module.css";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function VerticalMoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

function StatTotalIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19V5M4 19h16M8 15V9M12 15V7M16 15v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StatPendingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function StatOngoingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function StatDoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatIssueIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function useFixedDropdownPosition(triggerRef, open, options = {}) {
  const { minWidth = 0, align = "left" } = options;
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    const update = () => {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const width = Math.max(rect.width, minWidth);
      const left = align === "right" ? rect.right - width : rect.left;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < 200 && rect.top > spaceBelow;

      setPosition({
        top: openUp ? rect.top - 6 : rect.bottom + 6,
        left,
        width,
        transform: openUp ? "translateY(-100%)" : undefined,
      });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, triggerRef, minWidth, align]);

  return position;
}

function useDropdownDismiss(triggerRef, menuRef, open, onClose) {
  useEffect(() => {
    if (!open) return;
    const handleClick = (event) => {
      const target = event.target;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      onClose();
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose, triggerRef, menuRef]);
}

function MaterialDropdownPortal({ open, onClose, triggerRef, minWidth, align, menuClassName, children }) {
  const menuRef = useRef(null);
  const position = useFixedDropdownPosition(triggerRef, open, { minWidth, align });

  useDropdownDismiss(triggerRef, menuRef, open, onClose);

  if (!open || !position || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={menuRef}
      className={`${styles.materialDropdownMenu} ${menuClassName ?? ""}`}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: position.width,
        minWidth: position.width,
        transform: position.transform,
        zIndex: 300,
      }}
      role="presentation"
    >
      {children}
    </div>,
    document.body,
  );
}

function SupporterAvatar({ supporter, size = 28 }) {
  if (supporter.avatar) {
    return (
      <Image
        src={supporter.avatar}
        alt={supporter.name}
        width={size}
        height={size}
        className={styles.materialSupporterAvatar}
      />
    );
  }
  return (
    <span className={styles.materialSupporterFallback} aria-hidden>
      {getInitials(supporter.name)}
    </span>
  );
}

function MaterialStatusDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);

  const statusClass =
    value === "Pending"
      ? styles.materialStatusPending
      : value === "Done"
        ? styles.materialStatusDone
        : value === "On Going"
          ? styles.materialStatusOngoing
          : styles.materialStatusIssue;

  return (
    <div className={styles.materialDropdown} ref={triggerRef}>
      <button
        type="button"
        className={`${styles.materialStatusTrigger} ${statusClass}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value}
        <ChevronIcon />
      </button>
      <MaterialDropdownPortal open={open} onClose={close} triggerRef={triggerRef}>
        <div role="listbox">
          {MATERIAL_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              role="option"
              aria-selected={status === value}
              className={styles.materialDropdownItem}
              onClick={() => {
                onChange(status);
                close();
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </MaterialDropdownPortal>
    </div>
  );
}

function MaterialHandlerDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className={styles.materialDropdown} ref={triggerRef}>
      <button
        type="button"
        className={styles.materialSelectTrigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value || "Select"}
        <ChevronIcon />
      </button>
      <MaterialDropdownPortal open={open} onClose={close} triggerRef={triggerRef}>
        <div role="listbox">
          {MATERIAL_HANDLERS.map((handler) => (
            <button
              key={handler}
              type="button"
              role="option"
              aria-selected={handler === value}
              className={styles.materialDropdownItem}
              onClick={() => {
                onChange(handler);
                close();
              }}
            >
              {handler}
            </button>
          ))}
        </div>
      </MaterialDropdownPortal>
    </div>
  );
}

function MaterialSupportersDropdown({ supporterIds, onChange }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);

  const selected = MATERIAL_SUPPORTERS.filter((item) => supporterIds.includes(item.id));

  const toggleSupporter = (id) => {
    if (supporterIds.includes(id)) {
      onChange(supporterIds.filter((item) => item !== id));
    } else {
      onChange([...supporterIds, id]);
    }
  };

  return (
    <div className={styles.materialDropdown} ref={triggerRef}>
      <button
        type="button"
        className={styles.materialSupportersTrigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={styles.materialSupporterStack}>
          {selected.length === 0 ? (
            <span className={styles.materialSupporterEmpty}>—</span>
          ) : (
            selected.slice(0, 3).map((supporter) => (
              <SupporterAvatar key={supporter.id} supporter={supporter} />
            ))
          )}
        </span>
        <ChevronIcon />
      </button>
      <MaterialDropdownPortal
        open={open}
        onClose={close}
        triggerRef={triggerRef}
        minWidth={220}
        menuClassName={styles.materialSupportersMenu}
      >
        <div role="listbox">
          {MATERIAL_SUPPORTERS.map((supporter) => {
            const checked = supporterIds.includes(supporter.id);
            return (
              <button
                key={supporter.id}
                type="button"
                role="option"
                aria-selected={checked}
                className={`${styles.materialDropdownItem} ${styles.materialSupporterOption}`}
                onClick={() => toggleSupporter(supporter.id)}
              >
                <span className={`${styles.materialSupporterCheck} ${checked ? styles.materialSupporterCheckActive : ""}`} />
                <SupporterAvatar supporter={supporter} size={32} />
                {supporter.name}
              </button>
            );
          })}
        </div>
      </MaterialDropdownPortal>
    </div>
  );
}

function MaterialRowMenu({ onDelete }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className={styles.materialRowMenuWrap} ref={triggerRef}>
      <button
        type="button"
        className={styles.materialRowMenuBtn}
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <VerticalMoreIcon />
      </button>
      <MaterialDropdownPortal
        open={open}
        onClose={close}
        triggerRef={triggerRef}
        minWidth={140}
        align="right"
        menuClassName={styles.materialRowMenuDropdown}
      >
        <div role="menu">
          <button
            type="button"
            role="menuitem"
            className={styles.materialRowMenuItem}
            onClick={() => {
              onDelete();
              close();
            }}
          >
            <span className={styles.materialRowMenuIconDelete}>
              <TrashIcon />
            </span>
            Delete
          </button>
        </div>
      </MaterialDropdownPortal>
    </div>
  );
}

function MaterialStatCard({ label, value, icon, variant }) {
  return (
    <div className={`${styles.materialStatCard} ${styles[variant]}`}>
      <span className={styles.materialStatIcon}>{icon}</span>
      <div className={styles.materialStatContent}>
        <span className={styles.materialStatLabel}>{label}</span>
        <span className={styles.materialStatValue}>{value}</span>
      </div>
    </div>
  );
}

export function MaterialSection({ initialMaterials }) {
  const [materials, setMaterials] = useState(initialMaterials);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const stats = useMemo(() => computeMaterialStats(materials), [materials]);

  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return materials;
    return materials.filter((item) => {
      const haystack = `${item.name} ${item.unit} ${item.handler} ${item.note} ${item.status}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [materials, search]);

  const allVisibleSelected =
    filteredMaterials.length > 0 &&
    filteredMaterials.every((item) => selectedIds.includes(item.id));

  const updateMaterial = (id, patch) => {
    setMaterials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const deleteMaterials = (ids) => {
    setMaterials((prev) => renumberMaterials(prev.filter((item) => !ids.includes(item.id))));
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !filteredMaterials.some((item) => item.id === id)),
      );
    } else {
      const visibleIds = filteredMaterials.map((item) => item.id);
      setSelectedIds((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    deleteMaterials(selectedIds);
  };

  const handleNewMaterial = () => {
    const newItem = {
      id: `mat-${Date.now()}`,
      no: materials.length + 1,
      name: "",
      qty: "",
      unit: "Boxes",
      dueDate: "",
      handler: MATERIAL_HANDLERS[0],
      supporterIds: [],
      status: "Pending",
      note: "",
    };
    setMaterials((prev) => [...prev, newItem]);
  };

  return (
    <section className={styles.eventDetailSection}>
      <h3 className={styles.eventDetailSectionTitle}>Material Management</h3>

      <div className={styles.materialStatsGrid}>
        <MaterialStatCard
          label="Total Material"
          value={stats.total}
          icon={<StatTotalIcon />}
          variant="materialStatTotal"
        />
        <MaterialStatCard
          label="Pending Material"
          value={stats.pending}
          icon={<StatPendingIcon />}
          variant="materialStatPending"
        />
        <MaterialStatCard
          label="On Going Material"
          value={stats.onGoing}
          icon={<StatOngoingIcon />}
          variant="materialStatOngoing"
        />
        <MaterialStatCard
          label="Done Material"
          value={stats.done}
          icon={<StatDoneIcon />}
          variant="materialStatDone"
        />
        <MaterialStatCard
          label="Issue Material"
          value={stats.issue}
          icon={<StatIssueIcon />}
          variant="materialStatIssue"
        />
      </div>

      <div className={styles.materialToolbar}>
        <div className={styles.materialSearchWrap}>
          <span className={styles.eventsSearchIcon}>
            <SearchIcon />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className={styles.eventsSearchInput}
            aria-label="Search materials"
          />
        </div>
        <div className={styles.materialToolbarActions}>
          <button
            type="button"
            className={styles.materialBulkDeleteBtn}
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
          >
            <TrashIcon />
            Delete
          </button>
          <button type="button" className={styles.newCategoryBtn} onClick={handleNewMaterial}>
            + New Material
          </button>
        </div>
      </div>

      <div className={styles.materialTableWrap}>
        <div className={styles.materialTableColumns}>
          <label className={styles.materialCheckboxLabel}>
            <input
              type="checkbox"
              className={styles.materialCheckbox}
              checked={allVisibleSelected}
              onChange={toggleSelectAll}
              aria-label="Select all materials"
            />
          </label>
          <span>No</span>
          <span>Item Name</span>
          <span>Qty</span>
          <span>Unit</span>
          <span>Due Date</span>
          <span>Handler</span>
          <span>Supporters</span>
          <span>Status</span>
          <span>Note</span>
          <span>Action</span>
        </div>

        {filteredMaterials.length === 0 ? (
          <div className={styles.materialEmpty}>
            <span className={styles.materialEmptyEmoji} aria-hidden>🤷</span>
            <p>No materials match your search.</p>
          </div>
        ) : (
          <div className={styles.materialTableBody}>
            {filteredMaterials.map((item) => (
              <div key={item.id} className={styles.materialTableRow}>
                <label className={styles.materialCheckboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.materialCheckbox}
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    aria-label={`Select ${item.name || "material"}`}
                  />
                </label>
                <span className={styles.materialNoCell}>{item.no}</span>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateMaterial(item.id, { name: e.target.value })}
                  placeholder="Item name"
                  className={styles.materialCellInput}
                />
                <input
                  type="number"
                  min="0"
                  value={item.qty}
                  onChange={(e) => updateMaterial(item.id, { qty: e.target.value })}
                  className={styles.materialCellInputSmall}
                />
                <select
                  value={item.unit}
                  onChange={(e) => updateMaterial(item.id, { unit: e.target.value })}
                  className={styles.materialCellSelect}
                >
                  {MATERIAL_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                <div className={styles.materialDateWrap}>
                  <input
                    type="date"
                    value={item.dueDate}
                    onChange={(e) => updateMaterial(item.id, { dueDate: e.target.value })}
                    className={styles.materialCellDate}
                  />
                  <span className={styles.materialDateIcon} aria-hidden>
                    <CalendarIcon />
                  </span>
                </div>
                <MaterialHandlerDropdown
                  value={item.handler}
                  onChange={(handler) => updateMaterial(item.id, { handler })}
                />
                <MaterialSupportersDropdown
                  supporterIds={item.supporterIds}
                  onChange={(supporterIds) => updateMaterial(item.id, { supporterIds })}
                />
                <MaterialStatusDropdown
                  value={item.status}
                  onChange={(status) => updateMaterial(item.id, { status })}
                />
                <input
                  type="text"
                  value={item.note}
                  onChange={(e) => updateMaterial(item.id, { note: e.target.value })}
                  placeholder="Note"
                  className={styles.materialCellInput}
                />
                <MaterialRowMenu onDelete={() => deleteMaterials([item.id])} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
