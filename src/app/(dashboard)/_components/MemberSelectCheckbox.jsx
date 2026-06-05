"use client";

import styles from "./dashboard.module.css";

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IndeterminateIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.5 6h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MemberSelectCheckbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  "aria-label": ariaLabel,
}) {
  return (
    <label
      className={`${styles.memberCheckboxLabel} ${
        disabled ? styles.memberCheckboxLabelDisabled : ""
      }`}
    >
      <input
        type="checkbox"
        className={styles.memberCheckboxInput}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        aria-label={ariaLabel}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
        }}
      />
      <span
        className={`${styles.memberCheckboxBox} ${
          checked ? styles.memberCheckboxBoxChecked : ""
        } ${indeterminate ? styles.memberCheckboxBoxIndeterminate : ""}`}
        aria-hidden
      >
        {indeterminate ? <IndeterminateIcon /> : checked ? <CheckIcon /> : null}
      </span>
    </label>
  );
}
