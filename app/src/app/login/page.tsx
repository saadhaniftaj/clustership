"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simulate auth — replace with Supabase call
    await new Promise((r) => setTimeout(r, 1200));
    if (email && password) {
      router.push("/dashboard");
    } else {
      setError("Please enter your credentials.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 420 }} className="animate-fadeIn">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "linear-gradient(135deg, #25d366, #16a34a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
              boxShadow: "0 0 30px rgba(37,211,102,0.25)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <path
                d="M18 3C9.716 3 3 9.716 3 18c0 2.628.676 5.1 1.862 7.254L3 33l8.04-1.808A14.907 14.907 0 0018 33c8.284 0 15-6.716 15-15S26.284 3 18 3z"
                fill="white"
              />
            </svg>
          </div>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Sign in to your merchant dashboard
          </p>
        </div>

        {/* Card */}
        <div
          className="glass-strong"
          style={{ borderRadius: 20, padding: 32 }}
        >
          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
                fontSize: 13,
                marginBottom: 18,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  marginBottom: 6,
                }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="you@store.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                  }}
                >
                  Password
                </label>
                <a
                  href="#"
                  style={{
                    fontSize: 12,
                    color: "var(--accent-green)",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              id="login-btn"
              type="submit"
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "12px 20px" }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Signing in…
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            Don't have an account?{" "}
            <Link
              href="/signup"
              style={{ color: "var(--accent-green)", textDecoration: "none", fontWeight: 500 }}
            >
              Create store
            </Link>
          </div>
        </div>


      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
