"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  dashboardEvents,
  eventCategoryOptions,
  eventStatusOptions,
} from "../_data/eventsData";
import { CreateEventModal } from "./CreateEventModal";
import { DeleteEventModal } from "./DeleteEventModal";
import { DashboardHeader } from "./DashboardHeader";
import { EventCardMenu } from "./EventCardMenu";
import styles from "./dashboard.module.css";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function formatDateBadge(isoDate) {
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  return { day, month };
}

function DateFilterField({ id, label, value, onChange }) {
  return (
    <div className={styles.eventsFilterField}>
      <label htmlFor={id} className={styles.eventsFilterLabel}>
        {label}
      </label>
      <div className={styles.eventsFilterDateWrap}>
        {!value && (
          <span className={styles.eventsFilterDatePlaceholder}>MM,DD,YY</span>
        )}
        <input
          id={id}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${styles.eventsFilterDateInput} ${!value ? styles.eventsFilterDateEmpty : ""}`}
        />
        <span className={styles.eventsFilterDateIcon} aria-hidden>
          <CalendarIcon />
        </span>
      </div>
    </div>
  );
}

function DashboardEventCard({ event, onUpdate, onDelete }) {
  const { day, month } = formatDateBadge(event.startDate);
  const isOpen = event.status === "Open";

  return (
    <article className={styles.eventCard}>
      <div className={styles.eventCardImageWrap}>
        <Image
          src={event.image}
          alt={event.title}
          fill
          className={styles.eventCardImage}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className={styles.eventDateBadge}>
          <span className={styles.eventDateDay}>{day}</span>
          <span className={styles.eventDateMonth}>{month}</span>
        </div>
        <EventCardMenu onUpdate={() => onUpdate(event)} onDelete={() => onDelete(event)} />
      </div>

      <div className={styles.eventCardBody}>
        <div className={styles.eventCardTitleRow}>
          <h3 className={styles.eventCardTitle}>{event.title}</h3>
          <span
            className={isOpen ? styles.eventStatusOpen : styles.eventStatusClosed}
          >
            {event.status}
          </span>
        </div>

        <p className={styles.eventCardLocation}>
          <LocationIcon />
          <span>{event.address || "Location TBD"}</span>
        </p>

        <div className={styles.eventCardActions}>
          <Link
            href={`/dashboard/events/${event.id}/attendees`}
            className={styles.eventViewAttendeesBtn}
          >
            View all attendees
          </Link>
          <Link href={`/dashboard/events/${event.id}`} className={styles.eventViewDetailBtn}>
            View event detail
          </Link>
        </div>
      </div>
    </article>
  );
}

export function EventsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState(dashboardEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setModalOpen(true);
    }
  }, [searchParams]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      if (categoryFilter && event.category !== categoryFilter) return false;
      if (statusFilter && event.status !== statusFilter) return false;

      if (startDateFilter) {
        const start = new Date(event.startDate);
        const filterStart = new Date(startDateFilter);
        if (start < filterStart) return false;
      }

      if (endDateFilter) {
        const start = new Date(event.startDate);
        const filterEnd = new Date(endDateFilter);
        filterEnd.setHours(23, 59, 59, 999);
        if (start > filterEnd) return false;
      }

      if (query) {
        const haystack = `${event.title} ${event.category} ${event.address}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [events, categoryFilter, statusFilter, startDateFilter, endDateFilter, search]);

  const openModal = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    if (searchParams.get("create")) {
      router.replace("/dashboard/events");
    }
  };

  const handleSave = (data) => {
    setEvents((prev) => [
      {
        id: `evt-${Date.now()}`,
        status: "Open",
        ...data,
      },
      ...prev,
    ]);
  };

  const handleUpdate = (id, data) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...data } : event)),
    );
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setEvents((prev) => prev.filter((event) => event.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  return (
    <div className={styles.content}>
      <DashboardHeader title="Events" onNewEvent={openModal} />

      <div className={styles.eventsPageWrap}>
      <div className={styles.eventsFilterCard}>
        <div className={styles.eventsFilterRow}>
          <div className={styles.eventsFilterField}>
            <label htmlFor="event-category-filter" className={styles.eventsFilterLabel}>
              Event Category
            </label>
            <select
              id="event-category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={styles.eventsFilterSelect}
            >
                <option value="">Choose category</option>
                {eventCategoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>

          <div className={styles.eventsFilterField}>
            <label htmlFor="event-status-filter" className={styles.eventsFilterLabel}>
              Status
            </label>
            <select
              id="event-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.eventsFilterSelect}
            >
              <option value="">Choose status</option>
              {eventStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <DateFilterField
            id="event-start-filter"
            label="Start Date"
            value={startDateFilter}
            onChange={setStartDateFilter}
          />

          <DateFilterField
            id="event-end-filter"
            label="End Date"
            value={endDateFilter}
            onChange={setEndDateFilter}
          />
        </div>

        <div className={styles.eventsSearchWrap}>
          <span className={styles.eventsSearchIcon}>
            <SearchIcon />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className={styles.eventsSearchInput}
            aria-label="Search events"
          />
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <p className={styles.eventsEmpty}>No events match your filters.</p>
      ) : (
        <div className={styles.eventsGrid}>
          {filteredEvents.map((event) => (
            <DashboardEventCard
              key={event.id}
              event={event}
              onUpdate={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      </div>

      <CreateEventModal
        open={modalOpen || Boolean(editTarget)}
        editEvent={editTarget}
        categories={eventCategoryOptions}
        onClose={closeModal}
        onSave={handleSave}
        onUpdate={handleUpdate}
      />

      <DeleteEventModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
