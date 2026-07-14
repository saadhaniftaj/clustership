"use client";
import { useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";
import { formatCurrency, timeAgo } from "@/lib/utils";

// ── Mock data (replace with Supabase queries) ──
const stats = [
  {
    label: "Revenue Today",
    value: "$84,500",
    change: "+18%",
    up: true,
    icon: TrendingUp,
    color: "#25d366",
    bg: "rgba(37,211,102,0.1)",
  },
  {
    label: "Orders Today",
    value: "12",
    change: "+4",
    up: true,
    icon: ShoppingBag,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
  },
  {
    label: "Active Products",
    value: "248",
    change: "+6",
    up: true,
    icon: Package,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
  },
  {
    label: "AI Conversations",
    value: "39",
    change: "-2",
    up: false,
    icon: MessageSquare,
    color: "#f97316",
    bg: "rgba(249,115,22,0.1)",
  },
];

const recentOrders = [
  {
    id: "ORD-A4F2K1",
    customer: "Ahmed Khan",
    phone: "+92 300 1234567",
    items: "Nike Air Max × 1",
    total: 12500,
    status: "new",
    time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-B7X9M3",
    customer: "Sara Malik",
    phone: "+92 321 9876543",
    items: "Levi's Jeans × 2, Belt × 1",
    total: 8900,
    status: "processing",
    time: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-C2P5R8",
    customer: "Usman Ali",
    phone: "+92 333 5554321",
    items: "Polo T-Shirt × 3",
    total: 4200,
    status: "completed",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-D1K7N6",
    customer: "Fatima Zahra",
    phone: "+92 345 6781234",
    items: "Summer Dress × 1",
    total: 6800,
    status: "processing",
    time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-E9R3Q4",
    customer: "Hassan Sheikh",
    phone: "+92 311 2223456",
    items: "Sneakers × 1, Socks × 2",
    total: 9750,
    status: "completed",
    time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

const statusConfig: Record<string, { label: string; badge: string; icon: React.ElementType }> = {
  new: { label: "New", badge: "badge-green", icon: Clock },
  processing: { label: "Processing", badge: "badge-blue", icon: Truck },
  completed: { label: "Completed", badge: "badge-gray", icon: CheckCircle },
};

const weekData = [40, 65, 45, 80, 55, 90, 72];
const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const maxVal = Math.max(...weekData);

export default function DashboardPage() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>
          Good afternoon, Saad 👋
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats cards */}
      <div
        className="stagger"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {stats.map(({ label, value, change, up, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="glass stat-card animate-fadeIn"
            style={{ borderRadius: 16, padding: 20 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} color={color} />
              </div>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  color: up ? "#4ade80" : "#f87171",
                }}
              >
                {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {change}
              </span>
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts + mini activity row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* Revenue chart */}
        <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <div>
              <h2 style={{ fontSize: 16, marginBottom: 2 }}>Weekly Revenue</h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Last 7 days performance
              </p>
            </div>
            <span className="badge badge-green">+23% vs last week</span>
          </div>

          {/* Bar chart */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              height: 140,
            }}
          >
            {weekData.map((val, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  height: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: hoveredBar === i ? "var(--text-primary)" : "transparent",
                    fontWeight: 600,
                    transition: "color 0.2s",
                  }}
                >
                  {val}k
                </div>
                <div
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                  style={{
                    width: "100%",
                    height: `${(val / maxVal) * 100}%`,
                    borderRadius: "6px 6px 0 0",
                    background:
                      hoveredBar === i
                        ? "linear-gradient(180deg, #25d366, #16a34a)"
                        : i === weekData.length - 1
                        ? "linear-gradient(180deg, #4ade80 0%, #25d366 100%)"
                        : "rgba(37,211,102,0.2)",
                    transition: "background 0.2s, transform 0.2s",
                    transform: hoveredBar === i ? "scaleX(1.05)" : "scaleX(1)",
                    cursor: "default",
                    boxShadow: hoveredBar === i ? "0 0 12px rgba(37,211,102,0.3)" : "none",
                  }}
                />
                <div
                  style={{
                    fontSize: 10,
                    color:
                      i === weekData.length - 1
                        ? "var(--accent-green)"
                        : "var(--text-muted)",
                    fontWeight: i === weekData.length - 1 ? 600 : 400,
                  }}
                >
                  {weekLabels[i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats panel */}
        <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontSize: 16, marginBottom: 6 }}>Order Status</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>
            Today's breakdown
          </p>
          {[
            { label: "New", count: 3, color: "var(--accent-green)", pct: 25 },
            { label: "Processing", count: 5, color: "var(--accent-blue)", pct: 42 },
            { label: "Completed", count: 4, color: "var(--text-muted)", pct: 33 },
          ].map((s) => (
            <div key={s.label} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {s.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: s.color }}>
                  {s.count}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${s.pct}%`,
                    background: s.color === "var(--text-muted)"
                      ? "rgba(148,163,184,0.4)"
                      : `linear-gradient(90deg, ${s.color}, ${s.color}aa)`,
                  }}
                />
              </div>
            </div>
          ))}

          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: 16,
              marginTop: 8,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600,
              }}
            >
              Top Product Today
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #1e3a5f, #3b82f6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                👟
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                  Nike Air Max
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  5 sold · $12,500 each
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders table */}
      <div className="glass" style={{ borderRadius: 16, overflow: "hidden" }}>
        <div
          style={{
            padding: "20px 24px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ fontSize: 16, marginBottom: 2 }}>Recent Orders</h2>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Latest customer orders across all channels
            </p>
          </div>
          <a
            href="/dashboard/orders"
            style={{
              fontSize: 13,
              color: "var(--accent-green)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontWeight: 500,
            }}
          >
            View all <ArrowUpRight size={14} />
          </a>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => {
              const sc = statusConfig[order.status];
              return (
                <tr key={order.id}>
                  <td>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 12,
                        color: "var(--text-primary)",
                        background: "rgba(0,0,0,0.04)",
                        padding: "2px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {order.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #25d366, #16a34a)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "white",
                          flexShrink: 0,
                        }}
                      >
                        {order.customer[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                          {order.customer}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          {order.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ maxWidth: 180 }}>
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                        fontSize: 13,
                      }}
                    >
                      {order.items}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 13 }}>
                    {formatCurrency(order.total)}
                  </td>
                  <td>
                    <span className={`badge ${sc.badge}`}>
                      <sc.icon size={10} />
                      {sc.label}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {timeAgo(order.time)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
