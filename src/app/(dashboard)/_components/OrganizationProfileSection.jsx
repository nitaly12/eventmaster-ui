"use client";

import Image from "next/image";
import { useState } from "react";
import { defaultOrganizationProfile } from "../_data/organizationSettingsData";
import { AccountSettingsNav } from "./AccountSettingsNav";
import styles from "./dashboard.module.css";

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function AccountPlantDecoration() {
  return (
    <svg
      className={styles.accountCardPlant}
      width="180"
      height="140"
      viewBox="0 0 180 140"
      fill="none"
      aria-hidden
    >
      <path
        d="M30 120 Q50 90 70 100 T110 95 Q130 88 150 110"
        stroke="#E9D5FF"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M45 125 L55 75 M55 125 L68 55 M65 125 L85 65"
        stroke="#344054"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse cx="55" cy="128" rx="28" ry="8" stroke="#344054" strokeWidth="1.5" fill="#F9FAFB" />
      <path
        d="M40 90 Q48 70 55 75 Q62 80 70 88"
        stroke="#344054"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M60 60 Q72 45 80 58 Q88 72 75 85"
        stroke="#344054"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function OrganizationProfileSection() {
  const [form, setForm] = useState(defaultOrganizationProfile);
  const [saved, setSaved] = useState(defaultOrganizationProfile);
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setSaved({ ...form });
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...saved });
    setEditing(false);
  };

  return (
    <div className={styles.accountSettingsCard}>
      <div className={styles.accountSettingsBanner} />

      <div className={styles.accountSettingsBody}>
        <div className={styles.accountLogoWrap}>
          <Image
            src="/images/image_237-removebg 1.png"
            alt="Organization logo"
            width={120}
            height={120}
            className={styles.accountOrgLogo}
            priority
            quality={90}
          />
          <button type="button" className={styles.accountLogoEditBtn} aria-label="Change logo">
            <CameraIcon />
          </button>
        </div>

        <h2 className={styles.accountSectionHeading}>Organization Name</h2>

        <AccountSettingsNav />

        <div className={styles.accountFormGrid}>
          <div className={styles.accountFormField}>
            <label htmlFor="org-name" className={styles.accountFormLabel}>
              Organization Name<span className={styles.requiredMark}>*</span>
            </label>
            <input
              id="org-name"
              type="text"
              value={editing ? form.name : saved.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
              className={styles.accountFormInput}
              readOnly={!editing}
            />
          </div>

          <div className={styles.accountFormField}>
            <label htmlFor="org-address" className={styles.accountFormLabel}>
              Address<span className={styles.requiredMark}>*</span>
            </label>
            <input
              id="org-address"
              type="text"
              value={editing ? form.address : saved.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Enter address"
              className={styles.accountFormInput}
              readOnly={!editing}
            />
          </div>
        </div>

        <div className={styles.accountFormActions}>
          {editing ? (
            <>
              <button type="button" className={styles.accountCancelBtn} onClick={handleCancel}>
                Cancel
              </button>
              <button type="button" className={styles.accountSaveBtn} onClick={handleSave}>
                Save
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.accountEditBtn}
              onClick={() => {
                setForm({ ...saved });
                setEditing(true);
              }}
            >
              <EditIcon />
              Edit
            </button>
          )}
        </div>
      </div>

      <AccountPlantDecoration />
    </div>
  );
}
