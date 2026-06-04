"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  USER_REQUEST_PAGE_SIZE,
  userRequests as initialUserRequests,
} from "../_data/userRequestData";
import { DeleteMemberModal } from "./DeleteMemberModal";
import styles from "./dashboard.module.css";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
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

function RequestAvatar({ name, avatar }) {
  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name}
        width={36}
        height={36}
        className={styles.memberAvatar}
      />
    );
  }

  return (
    <span className={styles.memberAvatarFallback} aria-hidden>
      {getInitials(name)}
    </span>
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

export function UserRequestSection() {
  const [requests, setRequests] = useState(initialUserRequests);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return requests;
    return requests.filter((item) => item.name.toLowerCase().includes(query));
  }, [requests, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / USER_REQUEST_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageRequests = useMemo(() => {
    const start = (currentPage - 1) * USER_REQUEST_PAGE_SIZE;
    return filtered.slice(start, start + USER_REQUEST_PAGE_SIZE);
  }, [filtered, currentPage]);

  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const openConfirm = (request, action) => {
    setConfirmTarget({ id: request.id, name: request.name, action });
  };

  const closeConfirm = () => {
    setConfirmTarget(null);
  };

  const confirmAction = () => {
    if (confirmTarget) {
      setRequests((prev) => prev.filter((item) => item.id !== confirmTarget.id));
    }
    closeConfirm();
  };

  const modalTitle =
    confirmTarget?.action === "approve"
      ? "Are you sure you want to approve this user request?"
      : "Are you sure you want to reject this user request?";

  return (
    <>
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Show All User Request</h2>
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

        <div className={styles.userRequestTableColumns}>
          <span>ID</span>
          <span>Name</span>
          <span>Gender</span>
          <span>Email</span>
          <span>Address</span>
          <span>Phone Number</span>
          <span>Action</span>
        </div>

        <div className={styles.userRequestTableBody}>
          {pageRequests.length === 0 ? (
            <p className={styles.memberEmpty}>No user requests found.</p>
          ) : (
            pageRequests.map((request) => (
              <div key={request.id} className={styles.userRequestTableRow}>
                <span className={styles.memberId}>{request.id}</span>
                <div className={styles.memberNameCell}>
                  <RequestAvatar name={request.name} avatar={request.avatar} />
                  <span>{request.name}</span>
                </div>
                <span>{request.gender}</span>
                <span className={styles.memberEmail}>{request.email}</span>
                <span className={styles.memberAddress}>{request.address}</span>
                <span className={styles.attendeePhone}>{request.phone}</span>
                <div className={`${styles.actionCell} ${styles.userRequestActionCell}`}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.editBtn}`}
                    aria-label={`Approve ${request.name}`}
                    onClick={() => openConfirm(request, "approve")}
                  >
                    <CheckIcon />
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    aria-label={`Reject ${request.name}`}
                    onClick={() => openConfirm(request, "reject")}
                  >
                    <CloseIcon />
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
        open={Boolean(confirmTarget)}
        title={modalTitle}
        onClose={closeConfirm}
        onConfirm={confirmAction}
      />
    </>
  );
}
