"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { apiSend } from "@/lib/client-api";
import { notifyError } from "@/lib/toast";
import styles from "./login.module.css";

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

export function LoginComponent() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      await apiSend("/api/auth/login", "POST", {
        email: data.email,
        password: data.password,
      });
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed";
      const friendlyMessage =
        message === "Invalid email or password"
          ? "Incorrect email or password. Please try again or sign up."
          : message;
      notifyError(friendlyMessage);
    }
  };

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

        <div className={styles.main}>
          <div className={styles.card}>
            <h1 className={styles.cardTitle}>Login</h1>
            <p className={styles.cardSubtitle}>
              Welcome back! Please enter your information.
            </p>

            <form
              className={styles.form}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className={styles.field}>
                <label htmlFor="email">
                  Email<span className={styles.required}>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
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
                <label htmlFor="password">
                  Password<span className={styles.required}>*</span>
                </label>
                <div className={styles.passwordWrap}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && (
                  <p className={styles.errorText}>{errors.password.message}</p>
                )}
                <div className={styles.forgotRow}>
                  <Link href="/forgot-password" className={styles.forgotLink}>
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                Login
              </button>
            </form>

            <p className={styles.signupText}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className={styles.signupLink}>
                Sign up
              </Link>
            </p>
          </div>

          <aside className={styles.hero}>
            <svg
              className={styles.heroStar}
              viewBox="0 0 200 200"
              fill="#ffffff"
              aria-hidden
            >
              <path d="M100 8l18.5 56.5H178L128 98.5l18.5 56.5L100 152 53.5 155 72 98.5 22 64.5h59.5L100 8z" />
            </svg>
            <h2 className={styles.heroTitle}>Welcome !</h2>
            <p className={styles.heroSubtitle}>
              Log in to manage your events with ease and efficiency.
            </p>
            <div className={styles.heroImageWrap}>
              <Image
                src={ILLUSTRATION}
                alt="Login illustration"
                width={500}
                height={420}
                className={styles.heroImage}
                priority
              />
            </div>
          </aside>
        </div>

        <div className={styles.mobileHero}>
          <h2 className={styles.mobileHeroTitle}>Welcome !</h2>
          <p className={styles.mobileHeroSubtitle}>
            Log in to manage your events with ease and efficiency.
          </p>
          <Image
            src={ILLUSTRATION}
            alt="Login illustration"
            width={360}
            height={300}
            className={styles.mobileHeroImage}
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
