"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { MEMBERS_PAGE_SIZE, members as initialMembers } from "../_data/membersData";
import { DeleteMemberModal } from "./DeleteMemberModal";
import { RoleDropdown } from "./RoleDropdown";
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

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function MemberAvatar({ name, avatar }) {
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

export function MembersSection() {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return members;
    return members.filter((member) => member.name.toLowerCase().includes(query));
  }, [members, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / MEMBERS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageMembers = useMemo(() => {
    const start = (currentPage - 1) * MEMBERS_PAGE_SIZE;
    return filtered.slice(start, start + MEMBERS_PAGE_SIZE);
  }, [filtered, currentPage]);

  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleChange = (id, role) => {
    setMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, role } : member)),
    );
  };

  const handleDelete = (id) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const openDeleteModal = (member) => {
    setDeleteTarget({ id: member.id, name: member.name });
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      handleDelete(deleteTarget.id);
    }
    closeDeleteModal();
  };

  return (
    <>
    <div className={styles.tableCard}>
      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>Show All Members</h2>
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

      <div className={styles.memberTableColumns}>
        <span>ID</span>
        <span>Name</span>
        <span>Gender</span>
        <span>Email</span>
        <span>Address</span>
        <span>Role</span>
        <span>Action</span>
      </div>

      <div className={styles.memberTableBody}>
        {pageMembers.length === 0 ? (
          <p className={styles.memberEmpty}>No members found.</p>
        ) : (
          pageMembers.map((member) => (
            <div key={member.id} className={styles.memberTableRow}>
              <span className={styles.memberId}>{member.id}</span>
              <div className={styles.memberNameCell}>
                <MemberAvatar name={member.name} avatar={member.avatar} />
                <span>{member.name}</span>
              </div>
              <span>{member.gender}</span>
              <span className={styles.memberEmail}>{member.email}</span>
              <span className={styles.memberAddress}>{member.address}</span>
              <RoleDropdown
                role={member.role}
                onChange={(role) => handleRoleChange(member.id, role)}
              />
              <div className={styles.actionCell}>
                {member.role !== "Admin" && (
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    aria-label={`Delete ${member.name}`}
                    onClick={() => openDeleteModal(member)}
                  >
                    <TrashIcon />
                  </button>
                )}
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
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </>
  );
}
