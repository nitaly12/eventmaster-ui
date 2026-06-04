"use client";

import { useState } from "react";
import { eventCategories as initialCategories } from "../_data/overviewData";
import styles from "./dashboard.module.css";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import { UpdateCategoryModal } from "./UpdateCategoryModal";

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function formatToday() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function EventCategorySection() {
  const [categories, setCategories] = useState(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const [updateError, setUpdateError] = useState("");

  const openModal = () => {
    setCategoryName("");
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCategoryName("");
    setError("");
  };

  const handleCreate = () => {
    const trimmed = categoryName.trim();
    if (!trimmed) {
      setError("Category name is required");
      return;
    }
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("Category already exists");
      return;
    }

    setCategories((prev) => [
      ...prev,
      {
        id: `cat-${Date.now()}`,
        no: prev.length + 1,
        name: trimmed,
        createdAt: formatToday(),
        createdBy: "Thomas Brown",
      },
    ]);
    closeModal();
  };

  const handleDelete = (id) => {
    setCategories((prev) =>
      prev
        .filter((row) => row.id !== id)
        .map((row, index) => ({ ...row, no: index + 1 })),
    );
  };

  const openDeleteModal = (row) => {
    setDeleteTarget({ id: row.id, name: row.name });
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

  const openUpdateModal = (row) => {
    setUpdateTarget({ id: row.id, name: row.name });
    setUpdateName(row.name);
    setUpdateError("");
  };

  const closeUpdateModal = () => {
    setUpdateTarget(null);
    setUpdateName("");
    setUpdateError("");
  };

  const handleUpdate = () => {
    const trimmed = updateName.trim();
    if (!trimmed) {
      setUpdateError("Category name is required");
      return;
    }
    if (
      categories.some(
        (c) =>
          c.id !== updateTarget?.id &&
          c.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      setUpdateError("Category already exists");
      return;
    }

    setCategories((prev) =>
      prev.map((row) =>
        row.id === updateTarget?.id ? { ...row, name: trimmed } : row,
      ),
    );
    closeUpdateModal();
  };

  return (
    <>
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Event Category</h2>
          <button type="button" className={styles.newCategoryBtn} onClick={openModal}>
            + New Category
          </button>
        </div>

        <div className={styles.tableColumns}>
          <span>NO</span>
          <span>NAME</span>
          <span>CREATED AT</span>
          <span>CREATED BY</span>
          <span>ACTION</span>
        </div>

        <div className={styles.tableBody}>
          {categories.map((row) => (
            <div key={row.id} className={styles.tableRow}>
              <span>{row.no}</span>
              <span>{row.name}</span>
              <span>{row.createdAt}</span>
              <span>{row.createdBy}</span>
              <div className={styles.actionCell}>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  aria-label={`Delete ${row.name}`}
                  onClick={() => openDeleteModal(row)}
                >
                  <TrashIcon />
                </button>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.editBtn}`}
                  aria-label={`Edit ${row.name}`}
                  onClick={() => openUpdateModal(row)}
                >
                  <EditIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateCategoryModal
        open={modalOpen}
        value={categoryName}
        error={error}
        onChange={(val) => {
          setCategoryName(val);
          if (error) setError("");
        }}
        onClose={closeModal}
        onCreate={handleCreate}
      />

      <DeleteCategoryModal
        open={Boolean(deleteTarget)}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      <UpdateCategoryModal
        open={Boolean(updateTarget)}
        value={updateName}
        error={updateError}
        onChange={(val) => {
          setUpdateName(val);
          if (updateError) setUpdateError("");
        }}
        onClose={closeUpdateModal}
        onUpdate={handleUpdate}
      />
    </>
  );
}
