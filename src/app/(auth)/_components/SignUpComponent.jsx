"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./signup.module.css";

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.5 10.7A4 4 0 0 0 12 16a4 4 0 0 0 3.5-2.3M6.2 6.2C4.4 7.6 3 9.5 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 5.1A10.1 10.1 0 0 1 12 5c6.5 0 10 7 10 7s-1.1 2.2-3.2 4.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

const ILLUSTRATION = "/images/Tablet login-amico 2.png";

const defaultValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  organizationCode: "",
};

export function SignUpComponent() {
  const [role, setRole] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const password = watch("password");
  const isUser = role === "user";

  useEffect(() => {
    clearErrors();
  }, [role, clearErrors]);

  const onSubmit = async () => {
    // Wire to auth API when available (include role)
  };

  const fullNameField = (
    <div className={styles.field}>
      <label htmlFor="fullName">
        Full Name<span className={styles.required}>*</span>
      </label>
      <input
        id="fullName"
        type="text"
        autoComplete="name"
        placeholder="Enter your full name"
        className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
        {...register("fullName", { required: "Full name is required" })}
      />
      {errors.fullName && (
        <p className={styles.errorText}>{errors.fullName.message}</p>
      )}
    </div>
  );

  const emailField = (
    <div className={styles.field}>
      <label htmlFor="email">
        Email<span className={styles.required}>*</span>
      </label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        placeholder="Enter your email address"
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
  );

  const passwordField = (
    <div className={styles.field}>
      <label htmlFor="password">
        Password<span className={styles.required}>*</span>
      </label>
      <div className={styles.passwordWrap}>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Enter your password"
          className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        <button
          type="button"
          className={styles.eyeBtn}
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <EyeIcon open={showPassword} />
        </button>
      </div>
      {errors.password && (
        <p className={styles.errorText}>{errors.password.message}</p>
      )}
    </div>
  );

  const confirmPasswordField = (
    <div className={styles.field}>
      <label htmlFor="confirmPassword">
        Confirm Password<span className={styles.required}>*</span>
      </label>
      <div className={styles.passwordWrap}>
        <input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Enter your confirm password"
          className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
        />
        <button
          type="button"
          className={styles.eyeBtn}
          onClick={() => setShowConfirmPassword((v) => !v)}
          aria-label={
            showConfirmPassword
              ? "Hide confirm password"
              : "Show confirm password"
          }
        >
          <EyeIcon open={showConfirmPassword} />
        </button>
      </div>
      {errors.confirmPassword && (
        <p className={styles.errorText}>{errors.confirmPassword.message}</p>
      )}
    </div>
  );

  const phoneField = (
    <div className={styles.field}>
      <label htmlFor="phone">
        Phone Number<span className={styles.required}>*</span>
      </label>
      <input
        id="phone"
        type="tel"
        autoComplete="tel"
        placeholder="Enter your phone number"
        className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
        {...register("phone", { required: "Phone number is required" })}
      />
      {errors.phone && (
        <p className={styles.errorText}>{errors.phone.message}</p>
      )}
    </div>
  );

  const organizationCodeField = (
    <div className={styles.field}>
      <label htmlFor="organizationCode">
        Organization Code<span className={styles.required}>*</span>
      </label>
      <input
        id="organizationCode"
        type="text"
        autoComplete="off"
        placeholder="Enter organization code"
        className={`${styles.input} ${errors.organizationCode ? styles.inputError : ""}`}
        {...register("organizationCode", {
          validate: (value) =>
            role !== "user" || value?.trim()
              ? true
              : "Organization code is required",
        })}
      />
      {errors.organizationCode && (
        <p className={styles.errorText}>{errors.organizationCode.message}</p>
      )}
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.purpleHeader} aria-hidden>
        <svg
          className={styles.wave}
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,48 C240,120 480,0 720,56 C960,112 1200,24 1440,72 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      <div className={styles.shell}>
        <Link href="/" className={styles.backLink}>
          <BackIcon />
          Back
        </Link>

        <div className={styles.topHero}>
          <h1 className={styles.topHeroTitle}>Register New Account!</h1>
          <p className={styles.topHeroSubtitle}>
            Create a new account to access our application.
          </p>
        </div>

        <div className={styles.main}>
          <div className={styles.illustrationCol}>
            <svg
              className={styles.heroStar}
              viewBox="0 0 200 200"
              fill="#ffffff"
              aria-hidden
            >
              <path d="M100 8l18.5 56.5H178L128 98.5l18.5 56.5L100 152 53.5 155 72 98.5 22 64.5h59.5L100 8z" />
            </svg>
            <Image
              src={ILLUSTRATION}
              alt="Registration illustration"
              width={320}
              height={280}
              className={styles.illustration}
              priority
            />
          </div>

          <div className={styles.card}>
            <div className={styles.roleToggle} role="group" aria-label="Account role">
              <button
                type="button"
                className={`${styles.roleBtn} ${role === "admin" ? styles.roleBtnActive : ""}`}
                onClick={() => setRole("admin")}
                aria-pressed={role === "admin"}
              >
                ADMIN
              </button>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === "user" ? styles.roleBtnActive : ""}`}
                onClick={() => setRole("user")}
                aria-pressed={role === "user"}
              >
                USER
              </button>
            </div>

            <form
              className={styles.form}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {isUser ? (
                <div className={styles.formColumns}>
                  <div className={styles.formCol}>
                    {fullNameField}
                    {passwordField}
                    {phoneField}
                  </div>
                  <div className={styles.formCol}>
                    {emailField}
                    {confirmPasswordField}
                    {organizationCodeField}
                  </div>
                </div>
              ) : (
                <div className={styles.formGrid}>
                  {fullNameField}
                  {emailField}
                  {passwordField}
                  {confirmPasswordField}
                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label htmlFor="phone-admin">
                      Phone Number<span className={styles.required}>*</span>
                    </label>
                    <input
                      id="phone-admin"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Enter your phone number"
                      className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                      {...register("phone", {
                        required: "Phone number is required",
                      })}
                    />
                    {errors.phone && (
                      <p className={styles.errorText}>{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                Sign up
              </button>
            </form>

            <p className={styles.loginText}>
              Already have an account?{" "}
              <Link href="/login" className={styles.loginLink}>
                Login
              </Link>
            </p>
          </div>
        </div>

        <div className={styles.mobileIllustration}>
          <Image
            src={ILLUSTRATION}
            alt="Registration illustration"
            width={280}
            height={240}
            className={styles.mobileIllustrationImg}
          />
        </div>
      </div>
    </div>
  );
}

export default SignUpComponent;
