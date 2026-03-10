"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { ZeroLogo } from "../../components/brand/ZeroLogo";
import { SiteHeader } from "../../components/SiteHeader";
import styles from "../login/login.module.css";
import { toast } from "react-hot-toast";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided. The link may be broken.");
      return;
    }

    const verify = async () => {
      try {
        await api.post("/api/auth/verify-email", { token });
        setStatus("success");
        setMessage("Email verified successfully! You are now logged in.");
        toast.success("Email verified!");
        
        // Redirect to portal after a short delay
        setTimeout(() => {
          router.push("/portal");
        }, 2000);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed. The link may be expired or invalid.");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SiteHeader />
      <main className={styles.page}>
        <div className={styles.shell}>
          <section className={styles.formPane} style={{ margin: "0 auto", width: "100%", maxWidth: "500px" }}>
            <div className={styles.formCard}>
              <div className={styles.logoWrap}>
                <ZeroLogo variant="inverted" />
              </div>
              
              <h2 className={styles.title}>Email Verification</h2>
              
              <div style={{ textAlign: "center", margin: "2rem 0" }}>
                {status === "loading" && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <p className={styles.subtitle}>{message}</p>
                  </div>
                )}
                
                {status === "success" && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                    <div style={{ color: "#4ade80", fontSize: "3rem" }}>✓</div>
                    <p className={styles.subtitle} style={{ color: "white" }}>{message}</p>
                    <p className={styles.metaText}>Redirecting to your portal...</p>
                  </div>
                )}
                
                {status === "error" && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                    <div style={{ color: "#ef4444", fontSize: "3rem" }}>✗</div>
                    <p className={`${styles.metaText} ${styles.metaError}`}>{message}</p>
                    <button 
                      onClick={() => router.push("/login")}
                      className={styles.primaryButton}
                      style={{ marginTop: "1.5rem" }}
                    >
                      Go to Login
                    </button>
                  </div>
                )}
              </div>
              
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
