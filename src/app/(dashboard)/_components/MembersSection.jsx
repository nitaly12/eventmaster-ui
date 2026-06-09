"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MEMBERS_PAGE_SIZE } from "../_data/membersData";
import { apiGet, apiSend } from "@/lib/client-api";
import { DEFAULT_PROFILE_AVATAR } from "@/lib/default-avatar";
import { notifyDeleted, notifyUpdated } from "@/lib/toast";
import { DeleteMemberModal } from "./DeleteMemberModal";
import { TableRowsSkeleton } from "./PageContentSkeleton";
import { MemberSelectCheckbox } from "./MemberSelectCheckbox";
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

function isDeletable(member) {
  return member.role !== "Admin";
}

function MemberAvatar({ name, avatar, size = 36 }) {
  const src = avatar || DEFAULT_PROFILE_AVATAR;

  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className={styles.memberAvatar}
      style={{ width: size, height: size }}
    />
  );
}

function MemberCard({
  member,
  selected,
  onToggleSelect,
  onRoleChange,
  onDelete,
}) {
  const canSelect = isDeletable(member);

  return (
    <article
      className={`${styles.memberCard} ${selected ? styles.memberTableRowSelected : ""}`}
    >
      {canSelect && (
        <div className={styles.memberCardSelectRow}>
          <MemberSelectCheckbox
            checked={selected}
            onChange={() => onToggleSelect(member.id)}
            aria-label={`Select ${member.name}`}
          />
          <span className={styles.memberCardId}>{member.id}</span>
        </div>
      )}
      {!canSelect && <span className={styles.memberCardId}>{member.id}</span>}

      <div className={styles.memberCardProfile}>
        <MemberAvatar name={member.name} avatar={member.avatar} size={40} />
        <span className={styles.memberCardName}>{member.name}</span>
      </div>

      <div className={styles.memberCardDetails}>
        <p className={styles.memberCardLine}>{member.gender}</p>
        <p className={styles.memberCardLine}>{member.email}</p>
        <p className={styles.memberCardLine}>{member.address}</p>
      </div>

      <div className={styles.memberCardFooter}>
        <div className={styles.memberCardRole}>
          <RoleDropdown
            role={member.role}
            onChange={(role) => onRoleChange(member.id, role)}
          />
        </div>
        {canSelect && (
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.deleteBtn} ${styles.memberCardDelete}`}
            aria-label={`Delete ${member.name}`}
            onClick={() => onDelete(member)}
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </article>
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
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/members")
      .then((data) => setMembers(data))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

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

  const pageDeletableIds = useMemo(
    () => pageMembers.filter(isDeletable).map((member) => member.id),
    [pageMembers],
  );

  const selectedCount = selectedIds.size;

  const allPageSelected =
    pageDeletableIds.length > 0 &&
    pageDeletableIds.every((id) => selectedIds.has(id));

  const somePageSelected =
    pageDeletableIds.some((id) => selectedIds.has(id)) && !allPageSelected;

  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAllPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageDeletableIds.forEach((id) => next.delete(id));
      } else {
        pageDeletableIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleRoleChange = async (id, role) => {
    await apiSend(`/api/members/${id}`, "PATCH", { role });
    setMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, role } : member)),
    );
    notifyUpdated("Member role");
  };

  const openDeleteModal = (member) => {
    setDeleteTarget({ mode: "single", id: member.id, name: member.name });
  };

  const openBulkDeleteModal = () => {
    const count = selectedIds.size;
    setDeleteTarget({ mode: "bulk", ids: [...selectedIds], count });
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.mode === "single") {
      await apiSend(`/api/members/${deleteTarget.id}`, "DELETE");
      setMembers((prev) => prev.filter((member) => member.id !== deleteTarget.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteTarget.id);
        return next;
      });
    } else {
      await apiSend("/api/members", "DELETE", { ids: deleteTarget.ids });
      const idSet = new Set(deleteTarget.ids);
      setMembers((prev) => prev.filter((member) => !idSet.has(member.id)));
      clearSelection();
    }

    const toastLabel =
      deleteTarget.mode === "bulk"
        ? `${deleteTarget.ids.length} member${deleteTarget.ids.length === 1 ? "" : "s"}`
        : "Member";
    closeDeleteModal();
    notifyDeleted(toastLabel);
  };

  const deleteModalTitle =
    deleteTarget?.mode === "bulk"
      ? `Are you sure you want to remove ${deleteTarget.count} selected member${
          deleteTarget.count === 1 ? "" : "s"
        }?`
      : `Are you sure you want to remove ${deleteTarget?.name ?? "this member"}?`;

  return (
    <>
      <div className={`${styles.tableCard} ${styles.memberPageCard}`}>
        <div className={`${styles.tableHeader} ${styles.memberTableHeader}`}>
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

        {selectedCount > 0 && (
          <div className={styles.memberBulkBar}>
            <span className={styles.memberBulkCount}>
              {selectedCount} selected
            </span>
            <div>
              <button
                type="button"
                className={styles.memberBulkClearBtn}
                onClick={clearSelection}
              >
                Clear
              </button>
              <button
                type="button"
                className={styles.memberBulkDeleteBtn}
                onClick={openBulkDeleteModal}
              >
                <TrashIcon />
                Delete selected
              </button>
            </div>
          </div>
        )}

        <div className={styles.memberTableDesktop}>
          <div className={styles.memberTableColumns}>
            <span>
              <MemberSelectCheckbox
                checked={allPageSelected}
                indeterminate={somePageSelected}
                onChange={toggleSelectAllPage}
                disabled={pageDeletableIds.length === 0}
                aria-label="Select all members on this page"
              />
            </span>
            <span>ID</span>
            <span>Name</span>
            <span>Gender</span>
            <span>Email</span>
            <span>Address</span>
            <span>Role</span>
            <span>Action</span>
          </div>

          <div className={styles.memberTableBody}>
            {loading ? (
              <TableRowsSkeleton rows={5} />
            ) : pageMembers.length === 0 ? (
              <p className={styles.memberEmpty}>No members found.</p>
            ) : (
              pageMembers.map((member) => {
                const canSelect = isDeletable(member);
                const selected = selectedIds.has(member.id);

                return (
                  <div
                    key={member.id}
                    className={`${styles.memberTableRow} ${
                      selected ? styles.memberTableRowSelected : ""
                    }`}
                  >
                    <span>
                      {canSelect ? (
                        <MemberSelectCheckbox
                          checked={selected}
                          onChange={() => toggleSelect(member.id)}
                          aria-label={`Select ${member.name}`}
                        />
                      ) : null}
                    </span>
                    <span className={styles.memberId}>{member.id}</span>
                    <div className={styles.memberNameCell}>
                      <MemberAvatar name={member.name} avatar={member.avatar} />
                      <span className={styles.memberName}>{member.name}</span>
                    </div>
                    <span className={styles.memberCell}>{member.gender}</span>
                    <span className={`${styles.memberEmail} ${styles.memberCell}`}>
                      {member.email}
                    </span>
                    <span className={`${styles.memberAddress} ${styles.memberCell}`}>
                      {member.address}
                    </span>
                    <RoleDropdown
                      role={member.role}
                      onChange={(role) => handleRoleChange(member.id, role)}
                    />
                    <div className={styles.actionCell}>
                      {canSelect && (
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
                );
              })
            )}
          </div>
        </div>

        <div className={styles.memberCardsMobile}>
          {loading ? (
            <TableRowsSkeleton rows={4} />
          ) : pageMembers.length === 0 ? (
            <p className={styles.memberEmpty}>No members found.</p>
          ) : (
            pageMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                selected={selectedIds.has(member.id)}
                onToggleSelect={toggleSelect}
                onRoleChange={handleRoleChange}
                onDelete={openDeleteModal}
              />
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
        title={deleteModalTitle}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </>
  );
}
