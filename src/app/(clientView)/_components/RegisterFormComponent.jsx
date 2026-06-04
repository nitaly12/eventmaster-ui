"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import styles from "./register.module.css";

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RegisterFormComponent({ eventId, eventName, isOpen }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      companyName: "",
      gender: "",
      email: "",
      titlePosition: "",
    },
  });

  const onSubmit = async () => {
    // Wire to registration API when available (eventId)
  };

  if (!isOpen) {
    return (
      <div className={`container ${styles.page}`}>
        <Link href={`/detail/${eventId}`} className={styles.backLink}>
          <BackIcon />
          Back to events
        </Link>
        <div className={`${styles.card} ${styles.closedCard}`}>
          <h1 className={styles.closedTitle}>Registration closed</h1>
          <p className={styles.closedText}>
            {eventName} is no longer accepting new attendees.
          </p>
          <Link href={`/detail/${eventId}`} className={styles.closedLink}>
            View event
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <Link href={`/detail/${eventId}`} className={styles.backLink}>
        <BackIcon />
        Back to events
      </Link>

      <div className={styles.card}>
        <h1 className={styles.cardTitle}>Register Form</h1>
        {eventName && (
          <p className={styles.eventName}>Registering for: {eventName}</p>
        )}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="fullName">
                Full Name<span className={styles.required}>*</span>
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                placeholder="Enter full name"
                className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
                {...register("fullName", { required: "Full name is required" })}
              />
              {errors.fullName && (
                <p className={styles.errorText}>{errors.fullName.message}</p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="gender">
                Gender<span className={styles.required}>*</span>
              </label>
              <select
                id="gender"
                className={`${styles.select} ${errors.gender ? styles.selectError : ""}`}
                {...register("gender", { required: "Please select a gender" })}
              >
                <option value="" disabled>
                  Choosing gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className={styles.errorText}>{errors.gender.message}</p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">
                Phone Number<span className={styles.required}>*</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Enter phone number"
                className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                {...register("phone", { required: "Phone number is required" })}
              />
              {errors.phone && (
                <p className={styles.errorText}>{errors.phone.message}</p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="email">
                Email<span className={styles.required}>*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter email"
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className={styles.errorText}>{errors.email.message}</p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="companyName">
                Company Name<span className={styles.required}>*</span>
              </label>
              <input
                id="companyName"
                type="text"
                autoComplete="organization"
                placeholder="Enter company name"
                className={`${styles.input} ${errors.companyName ? styles.inputError : ""}`}
                {...register("companyName", {
                  required: "Company name is required",
                })}
              />
              {errors.companyName && (
                <p className={styles.errorText}>{errors.companyName.message}</p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="titlePosition">
                Title/Position{" "}
                <span className={styles.optional}>(optional)</span>
              </label>
              <input
                id="titlePosition"
                type="text"
                autoComplete="organization-title"
                placeholder="Enter title/position"
                className={styles.input}
                {...register("titlePosition")}
              />
            </div>
          </div>

          <div className={styles.footerRow}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
