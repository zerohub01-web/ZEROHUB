"use client";

import { FormEvent, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../../lib/api";
import { ZeroLogo } from "../../components/brand/ZeroLogo";
import { SiteHeader } from "../../components/SiteHeader";
import styles from "../login/login.module.css";

type PasswordStrength = {
  level: 0 | 1 | 2 | 3 | 4;
  label: string;
  tip: string;
};

function evaluatePassword(password: string): PasswordStrength {
  if (!password) {
    return { level: 0, label: "", tip: "" };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (password.length >= 12) score += 1;

  if (score <= 1) {
    return { level: 1, label: "Weak", tip: "Use 8+ chars with numbers and symbols." };
  }

  if (score <= 2) {
    return { level: 2, label: "Fair", tip: "Add uppercase letters and a special character." };
  }

  if (score <= 4) {
    return { level: 3, label: "Good", tip: "Good base. Increase length for better security." };
  }

  return { level: 4, label: "Strong", tip: "Strong password." };
}

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = useMemo(() => evaluatePassword(form.password), [form.password]);
  const strengthClass = useMemo(
    () => ({
      0: "",
      1: styles.strength1,
      2: styles.strength2,
      3: styles.strength3,
      4: styles.strength4
    } as const),
    []
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);

    const loadingId = toast.loading("Creating account...");
    try {
      await api.post("/api/auth/signup", form);
      toast.success("Account created successfully", { id: loadingId });
      window.location.href = "/portal";
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Signup failed";
      setError(msg);
      toast.error(msg, { id: loadingId });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SiteHeader />
      <main className={styles.page}>
        <div className={styles.shell}>
          <aside className={styles.infoPane}>
            <span className={styles.badge}>ZERO Access</span>
            <h1 className={styles.infoTitle}>Create Client Account</h1>
            <p className={styles.infoText}>
              Start your client workspace to track milestones, project files, approvals, and operational delivery in one place.
            </p>
            <ul className={styles.points}>
              <li>Milestone and timeline visibility</li>
              <li>Project notes and delivery file access</li>
              <li>Secure authenticated client portal</li>
            </ul>
          </aside>

          <section className={styles.formPane}>
            <div className={styles.formCard}>
              <div className={styles.logoWrap}>
                <ZeroLogo variant="inverted" />
              </div>

              <h2 className={styles.title}>Create Account</h2>
              <p className={styles.subtitle}>Set up your secure ZERO portal access in under a minute.</p>

              <form onSubmit={onSubmit} className={styles.form}>
                <div>
                  <label className={styles.label} htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    className={styles.input}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className={styles.label} htmlFor="email">Email</label>
                  <input
                    id="email"
                    className={styles.input}
                    placeholder="you@company.com"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className={styles.label} htmlFor="password">Password</label>
                  <div className={styles.inputWrap}>
                    <input
                      id="password"
                      className={`${styles.input} ${styles.passwordInput}`}
                      placeholder="Create a strong password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                      required
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {form.password ? (
                    <div className={styles.passwordMeter} role="status" aria-live="polite">
                      <div className={styles.passwordMeterTrack}>
                        <span
                          className={`${styles.passwordMeterFill} ${strengthClass[strength.level]}`}
                          style={{ width: `${strength.level * 25}%` }}
                        />
                      </div>
                      <p className={styles.passwordHint}>
                        Strength: <span className={styles.passwordHintValue}>{strength.label}</span>
                        {strength.tip ? ` · ${strength.tip}` : ""}
                      </p>
                    </div>
                  ) : null}
                </div>

                {error ? <p className={`${styles.metaText} ${styles.metaError}`}>{error}</p> : null}

                <button className={styles.primaryButton} disabled={sending}>
                  {sending ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <p className={styles.bottomText}>
                Already have an account? <a href="/login">Login</a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
