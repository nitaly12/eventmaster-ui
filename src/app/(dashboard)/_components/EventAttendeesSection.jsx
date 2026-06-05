"use client";

import { useEffect, useMemo, useState } from "react";
import { ATTENDEES_PAGE_SIZE } from "../_data/attendeesData";
import { apiGet, apiSend } from "@/lib/client-api";
import { notifyDeleted } from "@/lib/toast";
import { DeleteMemberModal } from "./DeleteMemberModal";
import { TableRowsSkeleton } from "./PageContentSkeleton";
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

function buildPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result = [];
  for (let i = 0; i < sorted.length; i += 1) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(sorted[i]);
  }
  return result;
}

export function EventAttendeesSection({ eventId, eventTitle }) {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  const reloadAttendees = async () => {
    const data = await apiGet(`/api/events/${eventId}/attendees`);
    setAttendees(data);
  };

  useEffect(() => {
    reloadAttendees()
      .catch(() => setAttendees([]))
      .finally(() => setLoading(false));
  }, [eventId]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return attendees;
    return attendees.filter((attendee) => attendee.name.toLowerCase().includes(query));
  }, [attendees, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ATTENDEES_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageAttendees = useMemo(() => {
    const start = (currentPage - 1) * ATTENDEES_PAGE_SIZE;
    return filtered.slice(start, start + ATTENDEES_PAGE_SIZE);
  }, [filtered, currentPage]);

  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await apiSend(
        `/api/events/${eventId}/attendees?attendeeId=${deleteTarget.id}`,
        "DELETE",
      );
      await reloadAttendees();
      notifyDeleted("Attendee");
    }
    setDeleteTarget(null);
  };

  return (
    <>
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>
            Show All Attendee in {eventTitle}
          </h2>
          <div className={styles.memberSearchWrap}>
            <span className={styles.memberSearchIcon}>
              <SearchIcon />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name"
              className={styles.memberSearchInput}
              aria-label="Search by name"
            />
          </div>
        </div>

        <div className={styles.attendeeTableColumns}>
          <span>ID</span>
          <span>Name</span>
          <span>Gender</span>
          <span>Email</span>
          <span>Address</span>
          <span>Phone Number</span>
          <span>Action</span>
        </div>

        <div className={styles.attendeeTableBody}>
          {loading ? (
            <TableRowsSkeleton rows={6} />
          ) : pageAttendees.length === 0 ? (
            <p className={styles.memberEmpty}>No attendees found.</p>
          ) : (
            pageAttendees.map((attendee) => (
              <div key={attendee.id} className={styles.attendeeTableRow}>
                <span className={styles.memberId}>{attendee.id}</span>
                <span className={styles.attendeeName}>{attendee.name}</span>
                <span>{attendee.gender}</span>
                <span className={styles.memberEmail}>{attendee.email}</span>
                <span className={styles.memberAddress}>{attendee.address}</span>
                <span className={styles.attendeePhone}>{attendee.phone}</span>
                <div className={styles.actionCell}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    aria-label={`Delete ${attendee.name}`}
                    onClick={() =>
                      setDeleteTarget({ id: attendee.id, name: attendee.name })
                    }
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {filtered.length > 0 && (
          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.paginationBtn}
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>

            {pageNumbers.map((item, index) =>
              item === "ellipsis" ? (
                <span key={`ellipsis-${index}`} className={styles.paginationEllipsis}>
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={`${styles.paginationBtn} ${styles.paginationNumber} ${
                    item === currentPage ? styles.paginationActive : ""
                  }`}
                  onClick={() => setPage(item)}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              className={styles.paginationBtn}
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <DeleteMemberModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
