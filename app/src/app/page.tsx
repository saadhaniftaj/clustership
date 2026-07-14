import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated SVG Wave Background */}
      <svg id="svg-background" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1, pointerEvents: "none", opacity: 0.1 }}>
        <defs>
          <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#25d366", stopOpacity:0.25}}/>
            <stop offset="100%" style={{stopColor:"#128c7e", stopOpacity:0.15}}/>
          </linearGradient>
          <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#dcf8c6", stopOpacity:0.2}}/>
            <stop offset="100%" style={{stopColor:"#25d366", stopOpacity:0.12}}/>
          </linearGradient>
          <linearGradient id="wg3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#128c7e", stopOpacity:0.15}}/>
            <stop offset="100%" style={{stopColor:"#dcf8c6", stopOpacity:0.08}}/>
          </linearGradient>
        </defs>
        <path fill="url(#wg1)">
          <animate attributeName="d" dur="20s" repeatCount="indefinite" values="M0,160 C320,300,420,300,740,160 C1060,20,1120,20,1440,160 V320 H0 V160 Z;M0,100 C320,20,420,20,740,100 C1060,180,1120,180,1440,100 V320 H0 V100 Z;M0,160 C320,300,420,300,740,160 C1060,20,1120,20,1440,160 V320 H0 V160 Z"/>
        </path>
        <path fill="url(#wg2)">
          <animate attributeName="d" dur="15s" repeatCount="indefinite" values="M0,100 C320,180,420,180,740,100 C1060,20,1120,20,1440,100 V320 H0 V100 Z;M0,160 C320,300,420,300,740,160 C1060,20,1120,20,1440,160 V320 H0 V160 Z;M0,100 C320,180,420,180,740,100 C1060,20,1120,20,1440,100 V320 H0 V100 Z"/>
        </path>
        <path fill="url(#wg3)">
          <animate attributeName="d" dur="25s" repeatCount="indefinite" values="M0,130 C320,250,420,250,740,130 C1060,10,1120,10,1440,130 V320 H0 V130 Z;M0,80 C320,10,420,10,740,80 C1060,150,1120,150,1440,80 V320 H0 V80 Z;M0,130 C320,250,420,250,740,130 C1060,10,1120,10,1440,130 V320 H0 V130 Z"/>
        </path>
      </svg>

      {/* Logo mark */}
      <div style={{ marginBottom: 32 }} className="animate-float">
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "linear-gradient(135deg, #25d366, #128c7e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 0 40px rgba(37,211,102,0.3)",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M18 3C9.716 3 3 9.716 3 18c0 2.628.676 5.1 1.862 7.254L3 33l8.04-1.808A14.907 14.907 0 0018 33c8.284 0 15-6.716 15-15S26.284 3 18 3z"
              fill="white"
              fillOpacity={0.9}
            />
            <path
              d="M13 16c0-.552.448-1 1-1h8a1 1 0 010 2h-8a1 1 0 01-1-1zm0 4c0-.552.448-1 1-1h5a1 1 0 010 2h-5a1 1 0 01-1-1z"
              fill="#128c7e"
            />
          </svg>
        </div>
      </div>

      <div className="animate-fadeIn" style={{ position: "relative", zIndex: 1 }}>
        <span
          style={{
            display: "inline-block",
            padding: "4px 14px",
            borderRadius: 999,
            background: "var(--brand-100)",
            border: "1px solid var(--brand-400)",
            color: "var(--brand-600)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          WhatsApp AI Commerce Platform
        </span>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            marginBottom: 20,
            lineHeight: 1.1,
            color: "var(--text-primary)"
          }}
        >
          Sell on WhatsApp
          <br />
          <span className="gradient-text">powered by AI</span>
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "var(--text-secondary)",
            maxWidth: 500,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          Your AI shopping assistant handles customer conversations 24/7 while
          you manage everything from one beautiful dashboard.
        </p>

        <div
          style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link href="/login" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
            Open Dashboard →
          </Link>
          <Link
            href="/dashboard"
            className="btn-secondary"
            style={{ fontSize: 16, padding: "14px 32px" }}
          >
            View Demo
          </Link>
        </div>


      </div>
    </main>
  );
}
