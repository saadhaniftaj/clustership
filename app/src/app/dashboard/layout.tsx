"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  MessageSquare,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/catalog", label: "Catalog", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* ─── Top Navigation Bar ─── */}
      <header
        style={{
          height: 64,
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "var(--bg-surface)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #25d366, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 0 16px rgba(37,211,102,0.3)",
              }}
            >
              <MessageSquare size={16} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.1 }}>
                Cluster Ship
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  style={{ padding: "8px 14px" }}
                >
                  <Icon size={16} />
                  {label}
                  {label === "Orders" && (
                    <span
                      style={{
                        marginLeft: 6,
                        background: "var(--accent-green)",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "1px 6px",
                        borderRadius: 999,
                      }}
                    >
                      3
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* WhatsApp status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 999,
              background: "rgba(37,211,102,0.08)",
              border: "1px solid rgba(37,211,102,0.15)",
            }}
          >
            <span className="wa-dot" />
            <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 500 }}>
              WhatsApp Live
            </span>
          </div>

          {/* Notification bell */}
          <div style={{ position: "relative" }}>
            <button
              className="btn-icon"
              onClick={() => setNotifOpen(!notifOpen)}
              title="Notifications"
            >
              <Bell size={18} />
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent-green)",
                  border: "2px solid var(--bg-surface)",
                }}
              />
            </button>

            {notifOpen && (
              <div
                className="glass-strong"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 12px)",
                  width: 320,
                  borderRadius: 14,
                  padding: 12,
                  zIndex: 20,
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    padding: "4px 8px",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Notifications
                </div>
                {[
                  { msg: "New order from Ahmed Khan", time: "2m ago", dot: "green" },
                  { msg: "New order from Sara Malik", time: "18m ago", dot: "green" },
                  { msg: "Stock low: Nike Air Max (3 left)", time: "1h ago", dot: "orange" },
                ].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "8px",
                      borderRadius: 10,
                      marginBottom: 4,
                      cursor: "pointer",
                      background: "rgba(0,0,0,0.03)",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: n.dot === "green" ? "var(--accent-green)" : "var(--accent-orange)",
                        marginTop: 4,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: 13, color: "var(--text-primary)" }}>
                        {n.msg}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {n.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User menu */}
          <div style={{ width: 1, height: 24, background: "var(--border)" }} />
          
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right", display: "none", "@media (min-width: 640px)": { display: "block" } } as any}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                Style Studio PK
              </div>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "white",
                cursor: "pointer",
              }}
            >
              S
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main style={{ flex: 1, padding: "32px 48px", overflowY: "auto", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        {children}
      </main>
    </div>
  );
}
