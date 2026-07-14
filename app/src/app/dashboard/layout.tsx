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
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* ─── Sidebar ─── */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 12px",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Brand */}
        <div style={{ padding: "8px 10px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #25d366, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 0 16px rgba(37,211,102,0.3)",
              }}
            >
              <MessageSquare size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                ShopBot AI
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Merchant Portal
              </div>
            </div>
          </div>
        </div>

        {/* Store selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(0,0,0,0.03)",
            border: "1px solid var(--border)",
            marginBottom: 20,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            S
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Style Studio PK
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span className="wa-dot" />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Active
              </span>
            </div>
          </div>
          <ChevronDown size={14} color="var(--text-muted)" />
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              padding: "0 10px",
              marginBottom: 8,
            }}
          >
            Menu
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                >
                  <Icon size={16} />
                  {label}
                  {label === "Orders" && (
                    <span
                      style={{
                        marginLeft: "auto",
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
          </div>
        </nav>

        {/* Bottom section */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #25d366, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "white",
              }}
            >
              S
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                Saad Taj
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Store Owner
              </div>
            </div>
          </div>

          <Link
            href="/login"
            className="nav-item"
            style={{ color: "var(--accent-red)" } as React.CSSProperties}
          >
            <LogOut size={16} />
            Sign out
          </Link>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header
          style={{
            height: 60,
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            background: "var(--bg-surface)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {new Date().toLocaleDateString("en-PK", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Notification bell */}
            <div style={{ position: "relative" }}>
              <button
                className="btn-icon"
                onClick={() => setNotifOpen(!notifOpen)}
                title="Notifications"
              >
                <Bell size={16} />
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 7,
                    height: 7,
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
                    top: "calc(100% + 8px)",
                    width: 300,
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
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: 28, overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
