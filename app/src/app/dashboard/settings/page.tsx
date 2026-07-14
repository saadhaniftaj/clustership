"use client";
import { useState } from "react";
import {
  Store,
  MessageSquare,
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  Copy,
  ExternalLink,
} from "lucide-react";

const tabs = [
  { id: "store", label: "Store Info", icon: Store },
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

function SaveToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 12, background: "var(--bg-elevated)", border: "1px solid rgba(37,211,102,0.3)", boxShadow: "var(--shadow-lg)", animation: "fadeIn 0.3s ease", zIndex: 100 }}>
      <CheckCircle size={16} color="var(--accent-green)" />
      <span style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 500 }}>Settings saved successfully</span>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("store");
  const [saved, setSaved] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState("");

  const [storeForm, setStoreForm] = useState({
    storeName: "Style Studio PK",
    greeting: "Welcome to Style Studio! 👋 How can I help you today? Browse our latest collection or search for a specific item.",
    ownerWa: "+92 300 1234567",
    timezone: "Asia/Karachi",
  });

  const [waForm, setWaForm] = useState({
    phoneNumberId: "123456789012345",
    accessToken: "EAAxxxxxxxxxxxxxxxxxxxxxxxx",
    appSecret: "abc123def456ghi789",
    verifyToken: "my_secret_verify_token_2024",
  });

  const [notifForm, setNotifForm] = useState({
    newOrder: true,
    lowStock: true,
    dailySummary: false,
    lowStockThreshold: "5",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>Settings</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Configure your store, WhatsApp integration, and notifications.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "stretch" }}>
        {/* Top tabs */}
        <div className="glass" style={{ borderRadius: 14, padding: "10px 14px", display: "flex", gap: 8, overflowX: "auto" }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`nav-item ${activeTab === id ? "active" : ""}`}
              style={{ border: "none", background: "none", whiteSpace: "nowrap" }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass" style={{ borderRadius: 16, padding: 28 }}>
          {/* ── STORE INFO ── */}
          {activeTab === "store" && (
            <div>
              <h2 style={{ fontSize: 18, marginBottom: 4 }}>Store Information</h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
                This information is used by your AI assistant to greet customers.
              </p>

              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, padding: 16, borderRadius: 12, background: "rgba(0,0,0,0.02)", border: "1px solid var(--border)" }}>
                <div style={{ width: 60, height: 60, borderRadius: 14, background: "linear-gradient(135deg, #25d366, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 0 20px rgba(37,211,102,0.2)" }}>
                  👗
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>Store Logo</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-secondary" style={{ fontSize: 12, padding: "6px 12px" }}>Upload Image</button>
                    <button className="btn-icon"><ExternalLink size={13} /></button>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Store Name</label>
                  <input className="input-field" value={storeForm.storeName} onChange={e => setStoreForm({ ...storeForm, storeName: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>
                    AI Greeting Message
                    <span style={{ marginLeft: 8, fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}>Sent when a new customer messages first</span>
                  </label>
                  <textarea className="input-field" rows={3} value={storeForm.greeting} onChange={e => setStoreForm({ ...storeForm, greeting: e.target.value })} style={{ resize: "none" }} />
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                    {storeForm.greeting.length}/160 characters
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Owner WhatsApp Number</label>
                    <input className="input-field" value={storeForm.ownerWa} onChange={e => setStoreForm({ ...storeForm, ownerWa: e.target.value })} placeholder="+92 300 1234567" />
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Order notifications will be sent here</div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Timezone</label>
                    <select className="input-field" value={storeForm.timezone} onChange={e => setStoreForm({ ...storeForm, timezone: e.target.value })}>
                      <option value="Asia/Karachi">Asia/Karachi (PKT +05:00)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST +04:00)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── WHATSAPP ── */}
          {activeTab === "whatsapp" && (
            <div>
              <h2 style={{ fontSize: 18, marginBottom: 4 }}>WhatsApp Integration</h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
                Connect your Meta WhatsApp Business Account to power the AI assistant.
              </p>

              {/* Status banner */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.15)", marginBottom: 24 }}>
                <span className="wa-dot" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#4ade80" }}>Connected & Active</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Receiving messages · 39 conversations today</div>
                </div>
                <a href="https://developers.facebook.com" target="_blank" style={{ marginLeft: "auto" }}>
                  <button className="btn-secondary" style={{ fontSize: 12, padding: "6px 12px" }}>
                    <ExternalLink size={12} /> Meta Dashboard
                  </button>
                </a>
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                {[
                  { label: "Phone Number ID", key: "phoneNumberId", value: waForm.phoneNumberId, help: "Found in Meta App → WhatsApp → API Setup" },
                  { label: "Verify Token", key: "verifyToken", value: waForm.verifyToken, help: "A random secret string you set during webhook setup" },
                ].map(({ label, key, value, help }) => (
                  <div key={key}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>
                      {label}
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input className="input-field" value={value} readOnly style={{ flex: 1, cursor: "default" }} />
                      <button className="btn-icon" onClick={() => copyToClipboard(value, key)}>
                        {copied === key ? <CheckCircle size={14} color="var(--accent-green)" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{help}</div>
                  </div>
                ))}

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>
                    Access Token
                    <span style={{ marginLeft: 8, fontSize: 11, color: "var(--accent-orange)", fontWeight: 400 }}>⚠ Keep secret</span>
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input className="input-field" type={showToken ? "text" : "password"} value={waForm.accessToken} onChange={e => setWaForm({ ...waForm, accessToken: e.target.value })} style={{ flex: 1 }} />
                    <button className="btn-icon" onClick={() => setShowToken(!showToken)}>
                      {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Webhook URL (read-only) */}
                <div style={{ padding: 14, borderRadius: 12, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-blue)", marginBottom: 6 }}>Webhook URL (set this in Meta)</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <code style={{ flex: 1, fontSize: 12, color: "var(--text-secondary)", background: "rgba(0,0,0,0.03)", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", display: "block" }}>
                      https://your-app.vercel.app/api/webhook
                    </code>
                    <button className="btn-icon" onClick={() => copyToClipboard("https://your-app.vercel.app/api/webhook", "webhook")}>
                      {copied === "webhook" ? <CheckCircle size={14} color="var(--accent-green)" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === "notifications" && (
            <div>
              <h2 style={{ fontSize: 18, marginBottom: 4 }}>Notification Preferences</h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
                Choose how and when you receive alerts about your store.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { key: "newOrder", label: "New Order Alert", desc: "Get a WhatsApp message when a customer places an order", badge: "Recommended" },
                  { key: "lowStock", label: "Low Stock Warning", desc: `Alert when product stock falls below ${notifForm.lowStockThreshold} units`, badge: null },
                  { key: "dailySummary", label: "Daily Summary", desc: "Receive a daily recap of orders and revenue at 9 PM", badge: null },
                ].map(({ key, label, desc, badge }) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{label}</span>
                        {badge && <span className="badge badge-green">{badge}</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle"
                      checked={notifForm[key as keyof typeof notifForm] as boolean}
                      onChange={e => setNotifForm({ ...notifForm, [key]: e.target.checked })}
                    />
                  </div>
                ))}
              </div>

              {notifForm.lowStock && (
                <div style={{ marginTop: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Low Stock Threshold (units)</label>
                  <input className="input-field" type="number" value={notifForm.lowStockThreshold} onChange={e => setNotifForm({ ...notifForm, lowStockThreshold: e.target.value })} style={{ maxWidth: 140 }} />
                </div>
              )}
            </div>
          )}

          {/* ── SECURITY ── */}
          {activeTab === "security" && (
            <div>
              <h2 style={{ fontSize: 18, marginBottom: 4 }}>Security</h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
                Manage your account password and security settings.
              </p>

              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Current Password</label>
                  <input className="input-field" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>New Password</label>
                  <input className="input-field" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Confirm New Password</label>
                  <input className="input-field" type="password" placeholder="••••••••" />
                </div>

                <div style={{ padding: 16, borderRadius: 12, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", marginTop: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f87171", marginBottom: 4 }}>Danger Zone</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>Permanently delete your store and all associated data. This action cannot be undone.</div>
                  <button className="btn-danger" style={{ fontSize: 13 }}>Delete Store & Account</button>
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          {activeTab !== "security" && (
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-primary" onClick={handleSave}>
                <Save size={15} /> Save Changes
              </button>
            </div>
          )}
          {activeTab === "security" && (
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-primary" onClick={handleSave}>
                <Save size={15} /> Update Password
              </button>
            </div>
          )}
        </div>
      </div>

      <SaveToast show={saved} />
    </div>
  );
}
