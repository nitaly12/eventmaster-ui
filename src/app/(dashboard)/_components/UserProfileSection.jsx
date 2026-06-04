"use client";

import Image from "next/image";
import { useState } from "react";
import {
  USER_GENDER_OPTIONS,
  defaultUserProfile,
} from "../_data/organizationSettingsData";
import { AccountSettingsNav } from "./AccountSettingsNav";
import styles from "./dashboard.module.css";

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

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
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

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.5 10.7A4 4 0 0 0 12 16a4 4 0 0 0 3.5-2.3M6.2 6.2C4.4 7.6 3 9.5 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9.9 5.1A10.1 10.1 0 0 1 12 5c6.5 0 10 7 10 7s-1.1 2.2-3.2 4.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
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
    </svg>
  );
}

function PasswordField({ id, label, value, onChange, visible, onToggle }) {
  return (
    <div className={styles.accountFormField}>
      <label htmlFor={id} className={styles.accountFormLabel}>
        {label}
        <span className={styles.requiredMark}>*</span>
      </label>
      <div className={styles.accountPasswordWrap}>
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.accountFormInput}
          autoComplete="off"
        />
        <button
          type="button"
          className={styles.accountPasswordToggle}
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
    </div>
  );
}

export function UserProfileSection() {
  const [form, setForm] = useState(defaultUserProfile);
  const [saved, setSaved] = useState(defaultUserProfile);
  const [showPasswordSection, setShowPasswordSection] = useState(true);
  const [passwords, setPasswords] = useState({
    current: "••••••••",
    newPassword: "••••••••",
    confirm: "••••••••",
  });
  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    newPassword: false,
    confirm: false,
  });

  const handleSave = () => {
    setSaved({ ...form });
  };

  const handleCancel = () => {
    setForm({ ...saved });
    setPasswords({
      current: "••••••••",
      newPassword: "••••••••",
      confirm: "••••••••",
    });
  };

  return (
    <div className={styles.userProfileCard}>
      <div className={styles.userProfileLayout}>
        <aside className={styles.userProfileAside}>
          <div className={styles.userProfileAvatarWrap}>
            <Image
              src={form.avatar}
              alt={form.name}
              width={160}
              height={160}
              className={styles.userProfileAvatar}
              priority
            />
            <button type="button" className={styles.userProfileAvatarEdit} aria-label="Change photo">
              <CameraIcon />
            </button>
          </div>
          <h3 className={styles.userProfileName}>{form.name}</h3>
          <p className={styles.userProfileRole}>{form.role}</p>
        </aside>

        <div className={styles.userProfileContent}>
          <AccountSettingsNav />

          <div className={styles.userProfileFieldsGrid}>
            <div className={styles.accountFormField}>
              <label htmlFor="user-name" className={styles.accountFormLabel}>
                Name<span className={styles.requiredMark}>*</span>
              </label>
              <input
                id="user-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className={styles.accountFormInput}
              />
            </div>

            <div className={styles.accountFormField}>
              <label htmlFor="user-gender" className={styles.accountFormLabel}>
                Gender<span className={styles.requiredMark}>*</span>
              </label>
              <select
                id="user-gender"
                value={form.gender}
                onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
                className={`${styles.accountFormInput} ${styles.accountFormSelect}`}
              >
                {USER_GENDER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.accountFormField}>
              <label htmlFor="user-email" className={styles.accountFormLabel}>
                Email<span className={styles.requiredMark}>*</span>
              </label>
              <input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className={styles.accountFormInput}
              />
            </div>

            <div className={styles.accountFormField}>
              <label htmlFor="user-date" className={styles.accountFormLabel}>
                Date<span className={styles.requiredMark}>*</span>
              </label>
              <div className={styles.accountDateWrap}>
                <input
                  id="user-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  className={`${styles.accountFormInput} ${styles.accountFormDate}`}
                />
                <span className={styles.accountDateIcon} aria-hidden>
                  <CalendarIcon />
                </span>
              </div>
            </div>

            <div className={styles.accountFormField}>
              <label htmlFor="user-phone" className={styles.accountFormLabel}>
                Phone Number<span className={styles.requiredMark}>*</span>
              </label>
              <input
                id="user-phone"
                type="text"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                className={styles.accountFormInput}
              />
            </div>

            <div className={styles.accountFormField}>
              <label htmlFor="user-address" className={styles.accountFormLabel}>
                Address<span className={styles.requiredMark}>*</span>
              </label>
              <input
                id="user-address"
                type="text"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                className={styles.accountFormInput}
              />
            </div>
          </div>

          <button
            type="button"
            className={styles.accountChangePasswordBtn}
            onClick={() => setShowPasswordSection((prev) => !prev)}
          >
            Change Password
          </button>

          {showPasswordSection && (
            <div className={styles.userProfilePasswordGrid}>
              <PasswordField
                id="current-password"
                label="Current Password"
                value={passwords.current}
                onChange={(value) => setPasswords((prev) => ({ ...prev, current: value }))}
                visible={passwordVisible.current}
                onToggle={() =>
                  setPasswordVisible((prev) => ({ ...prev, current: !prev.current }))
                }
              />
              <PasswordField
                id="new-password"
                label="New Password"
                value={passwords.newPassword}
                onChange={(value) => setPasswords((prev) => ({ ...prev, newPassword: value }))}
                visible={passwordVisible.newPassword}
                onToggle={() =>
                  setPasswordVisible((prev) => ({
                    ...prev,
                    newPassword: !prev.newPassword,
                  }))
                }
              />
              <PasswordField
                id="confirm-password"
                label="Confirm Password"
                value={passwords.confirm}
                onChange={(value) => setPasswords((prev) => ({ ...prev, confirm: value }))}
                visible={passwordVisible.confirm}
                onToggle={() =>
                  setPasswordVisible((prev) => ({ ...prev, confirm: !prev.confirm }))
                }
              />
            </div>
          )}

          <div className={styles.userProfileFooter}>
            <button type="button" className={styles.accountCancelBtn} onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" className={styles.userProfileSaveBtn} onClick={handleSave}>
              <span className={styles.modalCreateIcon}>
                <PlusIcon />
              </span>
              Save
            </button>
          </div>
        </div>
      </div>

      <AccountPlantDecoration />
    </div>
  );
}
