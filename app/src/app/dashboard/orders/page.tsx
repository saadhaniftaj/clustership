"use client";
import { useState } from "react";
import {
  Clock,
  Truck,
  CheckCircle,
  ChevronRight,
  X,
  MessageSquare,
  Phone,
  MapPin,
  Package,
  MoreHorizontal,
} from "lucide-react";
import { formatCurrency, timeAgo, formatDate } from "@/lib/utils";

type OrderStatus = "new" | "processing" | "completed";

interface OrderItem { name: string; qty: number; price: number; }
interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

const mockOrders: Order[] = [
  { id: "ORD-A4F2K1", customer: "Ahmed Khan", phone: "+92 300 1234567", address: "House 12, Block F, DHA Phase 5, Lahore", items: [{ name: "Nike Air Max 270", qty: 1, price: 12500 }], total: 12500, status: "new", createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
  { id: "ORD-B7X9M3", customer: "Sara Malik", phone: "+92 321 9876543", address: "Flat 4B, Zamzama Tower, Karachi", items: [{ name: "Levi's 511 Slim Jeans", qty: 2, price: 8900 }, { name: "Puma Belt", qty: 1, price: 1200 }], total: 19000, status: "new", createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString() },
  { id: "ORD-C2P5R8", customer: "Usman Ali", phone: "+92 333 5554321", address: "Street 9, G-10/2, Islamabad", items: [{ name: "Polo Ralph Lauren Tee", qty: 3, price: 4200 }], total: 12600, status: "new", createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
  { id: "ORD-D1K7N6", customer: "Fatima Zahra", phone: "+92 345 6781234", address: "House 7, Gulberg III, Lahore", items: [{ name: "Zara Summer Dress", qty: 1, price: 6800 }], total: 6800, status: "processing", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "ORD-E9R3Q4", customer: "Hassan Sheikh", phone: "+92 311 2223456", address: "Clifton Block 8, Karachi", items: [{ name: "Adidas Ultraboost 22", qty: 1, price: 18500 }, { name: "Sports Socks 3-Pack", qty: 2, price: 600 }], total: 19700, status: "processing", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
  { id: "ORD-F6M1T2", customer: "Ayesha Siddiqui", phone: "+92 301 7778899", address: "Model Town, Block J, Lahore", items: [{ name: "H&M Linen Blazer", qty: 1, price: 7200 }], total: 7200, status: "processing", createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: "ORD-G3N8V5", customer: "Bilal Chaudhry", phone: "+92 322 4445566", address: "Bahria Town, Phase 7, Rawalpindi", items: [{ name: "Nike Air Max 270", qty: 2, price: 12500 }], total: 25000, status: "completed", createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
  { id: "ORD-H9P4K7", customer: "Mehwish Tariq", phone: "+92 304 1112233", address: "Defence Housing, Karachi", items: [{ name: "Uniqlo Cashmere Sweater", qty: 1, price: 9500 }], total: 9500, status: "completed", createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() },
];

const columns: { status: OrderStatus; label: string; icon: React.ElementType; color: string; dotColor: string }[] = [
  { status: "new", label: "New Orders", icon: Clock, color: "var(--accent-green)", dotColor: "#25d366" },
  { status: "processing", label: "Processing", icon: Truck, color: "var(--accent-blue)", dotColor: "#3b82f6" },
  { status: "completed", label: "Completed", icon: CheckCircle, color: "var(--text-muted)", dotColor: "#64748b" },
];

function OrderDetailPanel({ order, onClose, onMove }: { order: Order; onClose: () => void; onMove: (id: string, status: OrderStatus) => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        style={{ maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px 0" }}>
          <div>
            <h2 style={{ fontSize: 18, marginBottom: 2 }}>Order Details</h2>
            <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-muted)" }}>{order.id}</span>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Customer info */}
          <div className="glass" style={{ borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #25d366, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white" }}>
                {order.customer[0]}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{order.customer}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Customer via WhatsApp</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                <Phone size={13} color="var(--text-muted)" /> {order.phone}
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                <MapPin size={13} color="var(--text-muted)" style={{ marginTop: 2, flexShrink: 0 }} /> {order.address}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                <MessageSquare size={13} color="var(--text-muted)" />
                <a href={`https://wa.me/${order.phone.replace(/\D/g, "")}`} target="_blank" style={{ color: "var(--accent-green)", textDecoration: "none" }}>
                  Open WhatsApp chat →
                </a>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="glass" style={{ borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
              Order Items
            </div>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < order.items.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0,0,0,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Package size={14} color="var(--text-muted)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--text-primary)" }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Qty: {item.qty}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{formatCurrency(item.qty * item.price)}</div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-green)" }}>{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Time */}
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>
            Ordered: {formatDate(order.createdAt)}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            {order.status === "new" && (
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => { onMove(order.id, "processing"); onClose(); }}>
                <Truck size={15} /> Move to Processing
              </button>
            )}
            {order.status === "processing" && (
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => { onMove(order.id, "completed"); onClose(); }}>
                <CheckCircle size={15} /> Mark Completed
              </button>
            )}
            {order.status === "completed" && (
              <div className="badge badge-gray" style={{ flex: 1, justifyContent: "center", padding: "10px" }}>
                <CheckCircle size={14} /> Order Completed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const moveOrder = (id: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>Order Management</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          {orders.filter(o => o.status === "new").length} new orders waiting · Drag to update status
        </p>
      </div>

      {/* Kanban board */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {columns.map(({ status, label, icon: Icon, color, dotColor }) => {
          const col = orders.filter(o => o.status === status);
          return (
            <div key={status} className="kanban-col" style={{ flex: 1, minWidth: 260 }}>
              {/* Column header */}
              <div className="kanban-col-header">
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${dotColor}1a`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={15} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{label}</div>
                </div>
                <span style={{ background: `${dotColor}22`, color: dotColor, border: `1px solid ${dotColor}44`, borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>
                  {col.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {col.length === 0 && (
                  <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-muted)", fontSize: 13 }}>
                    <Icon size={24} style={{ margin: "0 auto 8px", display: "block", opacity: 0.4 }} />
                    No orders
                  </div>
                )}
                {col.map(order => (
                  <div
                    key={order.id}
                    className="order-card"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${dotColor}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: dotColor }}>
                          {order.customer[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{order.customer}</div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace" }}>{order.id}</div>
                        </div>
                      </div>
                      <button className="btn-icon" style={{ width: 26, height: 26 }} onClick={e => { e.stopPropagation(); setSelectedOrder(order); }}>
                        <MoreHorizontal size={13} />
                      </button>
                    </div>

                    {/* Items preview */}
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10, padding: "8px 10px", background: "rgba(0,0,0,0.03)", borderRadius: 8, border: "1px solid var(--border)" }}>
                      {order.items.map(i => `${i.name} × ${i.qty}`).join(", ")}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                        {formatCurrency(order.total)}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)" }}>
                        <Clock size={10} />
                        {timeAgo(order.createdAt)}
                      </div>
                    </div>

                    {/* Quick action */}
                    {status !== "completed" && (
                      <button
                        className="btn-primary"
                        style={{ width: "100%", justifyContent: "center", marginTop: 10, padding: "7px 14px", fontSize: 12 }}
                        onClick={e => { e.stopPropagation(); moveOrder(order.id, status === "new" ? "processing" : "completed"); }}
                      >
                        {status === "new" ? <><Truck size={12} /> Process</> : <><CheckCircle size={12} /> Complete</>}
                        <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onMove={moveOrder}
        />
      )}
    </div>
  );
}
