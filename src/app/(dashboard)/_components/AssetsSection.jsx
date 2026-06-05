"use client";

import { useEffect, useMemo, useState } from "react";
import { ASSETS_PAGE_SIZE, getAssetStatus } from "../_data/assetsData";
import { apiGet, apiSend } from "@/lib/client-api";
import { notifyCreated, notifyDeleted, notifyUpdated } from "@/lib/toast";
import { CreateAssetModal } from "./CreateAssetModal";
import { DeleteAssetModal } from "./DeleteAssetModal";
import { TableRowsSkeleton } from "./PageContentSkeleton";
import { MemberSelectCheckbox } from "./MemberSelectCheckbox";
import { UpdateAssetModal } from "./UpdateAssetModal";
import styles from "./dashboard.module.css";

const EMPTY_FORM = { name: "", qty: "", unit: "" };

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

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
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

function validateAssetForm(form, assets, excludeId) {
  const errors = {};
  const trimmedName = form.name.trim();

  if (!trimmedName) errors.name = "Asset name is required";
  if (form.qty === "" || Number(form.qty) < 0) errors.qty = "Valid quantity is required";
  if (!form.unit) errors.unit = "Unit is required";

  if (
    trimmedName &&
    assets.some(
      (asset) =>
        asset.id !== excludeId && asset.name.toLowerCase() === trimmedName.toLowerCase(),
    )
  ) {
    errors.name = "Asset already exists";
  }

  return errors;
}

function AssetCard({ asset, selected, onToggleSelect, onDelete, onEdit }) {
  const status = getAssetStatus(asset.qty);

  return (
    <article
      className={`${styles.assetCard} ${selected ? styles.assetCardSelected : ""}`}
    >
      <div className={styles.memberCardSelectRow}>
        <MemberSelectCheckbox
          checked={selected}
          onChange={() => onToggleSelect(asset.id)}
          aria-label={`Select ${asset.name}`}
        />
        <span className={styles.assetCardNo}>{asset.no}</span>
      </div>
      <span className={styles.assetNamePill}>{asset.name}</span>
      <p
        className={`${styles.assetCardLine} ${
          asset.qty === 0 ? styles.assetQtyZero : ""
        }`}
      >
        {asset.qty}
      </p>
      <p className={styles.assetCardLine}>{asset.unit}</p>
      <p className={styles.assetCardLine}>{asset.createdBy}</p>
      <span
        className={
          status === "In Stock" ? styles.statusInStock : styles.statusOutOfStock
        }
      >
        {status}
      </span>
      <div className={styles.assetCardActions}>
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          aria-label={`Delete ${asset.name}`}
          onClick={() => onDelete(asset)}
        >
          <TrashIcon />
        </button>
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.editBtn}`}
          aria-label={`Edit ${asset.name}`}
          onClick={() => onEdit(asset)}
        >
          <EditIcon />
        </button>
      </div>
    </article>
  );
}

export function AssetsSection() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/assets")
      .then((data) => setAssets(data))
      .catch(() => setAssets([]))
      .finally(() => setLoading(false));
  }, []);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [createErrors, setCreateErrors] = useState({});
  const [updateTarget, setUpdateTarget] = useState(null);
  const [updateForm, setUpdateForm] = useState(EMPTY_FORM);
  const [updateErrors, setUpdateErrors] = useState({});
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return assets;
    return assets.filter((asset) => asset.name.toLowerCase().includes(query));
  }, [assets, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ASSETS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageAssets = useMemo(() => {
    const start = (currentPage - 1) * ASSETS_PAGE_SIZE;
    return filtered.slice(start, start + ASSETS_PAGE_SIZE);
  }, [filtered, currentPage]);

  const pageIds = useMemo(() => pageAssets.map((asset) => asset.id), [pageAssets]);

  const selectedCount = selectedIds.size;

  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));

  const somePageSelected =
    pageIds.some((id) => selectedIds.has(id)) && !allPageSelected;

  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  const reloadAssets = async () => {
    const data = await apiGet("/api/assets");
    setAssets(data);
  };

  const openCreateModal = () => {
    setCreateForm(EMPTY_FORM);
    setCreateErrors({});
    setCreateOpen(true);
  };

  const closeCreateModal = () => {
    setCreateOpen(false);
    setCreateForm(EMPTY_FORM);
    setCreateErrors({});
  };

  const handleCreate = async () => {
    const errors = validateAssetForm(createForm, assets);
    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors);
      return;
    }

    await apiSend("/api/assets", "POST", {
      name: createForm.name.trim(),
      qty: Number(createForm.qty),
      unit: createForm.unit,
      createdBy: "Thomas Brown",
    });
    await reloadAssets();
    closeCreateModal();
    notifyCreated("Asset");
  };

  const openUpdateModal = (asset) => {
    setUpdateTarget(asset);
    setUpdateForm({
      name: asset.name,
      qty: String(asset.qty),
      unit: asset.unit,
    });
    setUpdateErrors({});
  };

  const closeUpdateModal = () => {
    setUpdateTarget(null);
    setUpdateForm(EMPTY_FORM);
    setUpdateErrors({});
  };

  const handleUpdate = async () => {
    const errors = validateAssetForm(updateForm, assets, updateTarget?.id);
    if (Object.keys(errors).length > 0) {
      setUpdateErrors(errors);
      return;
    }

    await apiSend(`/api/assets/${updateTarget?.id}`, "PATCH", {
      name: updateForm.name.trim(),
      qty: Number(updateForm.qty),
      unit: updateForm.unit,
    });
    await reloadAssets();
    closeUpdateModal();
    notifyUpdated("Asset");
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
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const openDeleteModal = (asset) => {
    setDeleteTarget({ mode: "single", id: asset.id, name: asset.name });
  };

  const openBulkDeleteModal = () => {
    setDeleteTarget({ mode: "bulk", ids: [...selectedIds], count: selectedIds.size });
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.mode === "single") {
      await apiSend(`/api/assets/${deleteTarget.id}`, "DELETE");
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteTarget.id);
        return next;
      });
    } else {
      await apiSend("/api/assets", "DELETE", { ids: deleteTarget.ids });
      clearSelection();
    }

    const toastLabel =
      deleteTarget.mode === "bulk"
        ? `${deleteTarget.count} asset${deleteTarget.count === 1 ? "" : "s"}`
        : "Asset";
    await reloadAssets();
    closeDeleteModal();
    notifyDeleted(toastLabel);
  };

  const deleteModalTitle =
    deleteTarget?.mode === "bulk"
      ? `Do you want to remove ${deleteTarget.count} selected asset${
          deleteTarget.count === 1 ? "" : "s"
        }?`
      : `Do you want to remove ${deleteTarget?.name ?? "this asset"}?`;

  return (
    <>
      <div className={`${styles.tableCard} ${styles.assetPageCard}`}>
        <div className={styles.assetTableHeader}>
          <h2 className={styles.tableTitle}>Asset Management</h2>
          <div className={styles.assetSearchWrap}>
            <span className={styles.memberSearchIcon}>
              <SearchIcon />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                setSelectedIds(new Set());
              }}
              placeholder="Angkor"
              className={styles.assetSearchInput}
              aria-label="Search assets"
            />
          </div>
          <button type="button" className={styles.newCategoryBtn} onClick={openCreateModal}>
            + New Asset
          </button>
        </div>

        {selectedCount > 0 && (
          <div className={styles.memberBulkBar}>
            <span className={styles.memberBulkCount}>{selectedCount} selected</span>
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

        <div className={styles.assetTableDesktop}>
          <div className={styles.assetTableColumns}>
            <span>
              <MemberSelectCheckbox
                checked={allPageSelected}
                indeterminate={somePageSelected}
                onChange={toggleSelectAllPage}
                disabled={pageIds.length === 0}
                aria-label="Select all assets on this page"
              />
            </span>
            <span>No</span>
            <span>Asset Name</span>
            <span>Qty</span>
            <span>Unit</span>
            <span>Created By</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          <div className={styles.assetTableBody}>
            {loading ? (
              <TableRowsSkeleton rows={6} />
            ) : pageAssets.length === 0 ? (
              <p className={styles.memberEmpty}>No assets found.</p>
            ) : (
              pageAssets.map((asset) => {
                const status = getAssetStatus(asset.qty);
                const selected = selectedIds.has(asset.id);

                return (
                  <div
                    key={asset.id}
                    className={`${styles.assetTableRow} ${
                      selected ? styles.memberTableRowSelected : ""
                    }`}
                  >
                    <span>
                      <MemberSelectCheckbox
                        checked={selected}
                        onChange={() => toggleSelect(asset.id)}
                        aria-label={`Select ${asset.name}`}
                      />
                    </span>
                    <span className={styles.memberId}>{asset.no}</span>
                    <span className={styles.assetNamePill}>{asset.name}</span>
                    <span className={asset.qty === 0 ? styles.assetQtyZero : undefined}>
                      {asset.qty}
                    </span>
                    <span>{asset.unit}</span>
                    <span>{asset.createdBy}</span>
                    <span
                      className={
                        status === "In Stock" ? styles.statusInStock : styles.statusOutOfStock
                      }
                    >
                      {status}
                    </span>
                    <div className={styles.actionCell}>
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        aria-label={`Delete ${asset.name}`}
                        onClick={() => openDeleteModal(asset)}
                      >
                        <TrashIcon />
                      </button>
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        aria-label={`Edit ${asset.name}`}
                        onClick={() => openUpdateModal(asset)}
                      >
                        <EditIcon />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.assetCardsMobile}>
          {loading ? (
            <TableRowsSkeleton rows={4} />
          ) : pageAssets.length === 0 ? (
            <p className={styles.memberEmpty}>No assets found.</p>
          ) : (
            pageAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                selected={selectedIds.has(asset.id)}
                onToggleSelect={toggleSelect}
                onDelete={openDeleteModal}
                onEdit={openUpdateModal}
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
                    item === currentPage ? styles.assetPaginationActive : ""
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

      <CreateAssetModal
        open={createOpen}
        form={createForm}
        errors={createErrors}
        onChange={(field, value) => {
          setCreateForm((prev) => ({ ...prev, [field]: value }));
          if (createErrors[field]) {
            setCreateErrors((prev) => {
              const next = { ...prev };
              delete next[field];
              return next;
            });
          }
        }}
        onClose={closeCreateModal}
        onCreate={handleCreate}
      />

      <UpdateAssetModal
        open={Boolean(updateTarget)}
        form={updateForm}
        errors={updateErrors}
        onChange={(field, value) => {
          setUpdateForm((prev) => ({ ...prev, [field]: value }));
          if (updateErrors[field]) {
            setUpdateErrors((prev) => {
              const next = { ...prev };
              delete next[field];
              return next;
            });
          }
        }}
        onClose={closeUpdateModal}
        onUpdate={handleUpdate}
      />

      <DeleteAssetModal
        open={Boolean(deleteTarget)}
        title={deleteModalTitle}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </>
  );
}
