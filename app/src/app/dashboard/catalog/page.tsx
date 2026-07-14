"use client";
import { useState } from "react";
import {
  Plus,
  Search,
  Upload,
  Edit2,
  Trash2,
  Package,
  Filter,
  ChevronDown,
  X,
  ImageIcon,
  CheckCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const categories = ["All", "Footwear", "Tops", "Bottoms", "Dresses", "Accessories"];

const initialProducts = [
  { id: "1", name: "Nike Air Max 270", category: "Footwear", price: 12500, stock: 24, sku: "NK-AM-270", active: true, image: "👟" },
  { id: "2", name: "Levi's 511 Slim Jeans", category: "Bottoms", price: 8900, stock: 47, sku: "LV-511-32", active: true, image: "👖" },
  { id: "3", name: "Polo Ralph Lauren Tee", category: "Tops", price: 4200, stock: 3, sku: "PL-TEE-M", active: true, image: "👕" },
  { id: "4", name: "Zara Summer Dress", category: "Dresses", price: 6800, stock: 15, sku: "ZR-SD-001", active: true, image: "👗" },
  { id: "5", name: "Adidas Ultraboost 22", category: "Footwear", price: 18500, stock: 8, sku: "AD-UB-22", active: false, image: "🏃" },
  { id: "6", name: "H&M Linen Blazer", category: "Tops", price: 7200, stock: 12, sku: "HM-LB-L", active: true, image: "🧥" },
  { id: "7", name: "Puma Cap Classic", category: "Accessories", price: 1800, stock: 0, sku: "PM-CAP-01", active: true, image: "🧢" },
  { id: "8", name: "Uniqlo Cashmere Sweater", category: "Tops", price: 9500, stock: 6, sku: "UQ-CS-BLK", active: true, image: "🧶" },
];

type Product = typeof initialProducts[0];

function AddProductModal({ onClose, onSave }: { onClose: () => void; onSave: (p: Partial<Product>) => void }) {
  const [form, setForm] = useState({ name: "", category: "Footwear", price: "", stock: "", sku: "", description: "" });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px 0" }}>
          <h2 style={{ fontSize: 18 }}>Add New Product</h2>
          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <div style={{ padding: 24 }}>
          {/* Image upload placeholder */}
          <div
            style={{
              border: "2px dashed var(--border-strong)",
              borderRadius: 12,
              padding: 24,
              textAlign: "center",
              marginBottom: 20,
              cursor: "pointer",
              transition: "border-color 0.2s, background 0.2s",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <ImageIcon size={28} color="var(--text-muted)" style={{ margin: "0 auto 8px" }} />
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Click to upload product image</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>PNG, JPG up to 5MB</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 5 }}>Product Name *</label>
              <input className="input-field" placeholder="e.g. Nike Air Max 270" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 5 }}>Category</label>
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 5 }}>SKU</label>
              <input className="input-field" placeholder="NK-AM-270" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 5 }}>Price ($) *</label>
              <input className="input-field" type="number" placeholder="12500" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 5 }}>Stock Qty *</label>
              <input className="input-field" type="number" placeholder="50" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 5 }}>Description</label>
              <textarea className="input-field" placeholder="Brief product description for AI context…" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: "none" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button className="btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Cancel</button>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => { onSave({ ...form, price: Number(form.price), stock: Number(form.stock), image: "🛍️", active: true }); onClose(); }}>
              <Plus size={15} /> Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvSuccess, setShowCsvSuccess] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = products.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = (data: Partial<Product>) => {
    const newProduct: Product = {
      id: String(Date.now()),
      name: data.name || "New Product",
      category: data.category || "Other",
      price: data.price || 0,
      stock: data.stock || 0,
      sku: data.sku || "-",
      active: true,
      image: data.image || "🛍️",
    };
    setProducts([newProduct, ...products]);
  };

  const handleToggle = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    setDeleteId(null);
  };

  const handleCsvUpload = () => {
    setShowCsvSuccess(true);
    setTimeout(() => setShowCsvSuccess(false), 3000);
  };

  return (
    <div className="animate-fadeIn">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Product Catalog</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {products.length} products · {products.filter(p => p.active).length} active
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-secondary" onClick={handleCsvUpload}>
            <Upload size={15} /> Import CSV
          </button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {/* CSV success toast */}
      {showCsvSuccess && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", marginBottom: 16, animation: "fadeIn 0.3s ease" }}>
          <CheckCircle size={16} color="var(--accent-green)" />
          <span style={{ fontSize: 13, color: "#4ade80" }}>50 products imported successfully!</span>
        </div>
      )}

      {/* Filters */}
      <div className="glass" style={{ borderRadius: 14, padding: "14px 16px", marginBottom: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input className="input-field" placeholder="Search products or SKU…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                border: "1px solid",
                borderColor: activeCategory === cat ? "var(--accent-green)" : "var(--border)",
                background: activeCategory === cat ? "var(--accent-green-glow)" : "transparent",
                color: activeCategory === cat ? "var(--accent-green)" : "var(--text-muted)",
                transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products table */}
      <div className="glass" style={{ borderRadius: 16, overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>
                  <Package size={32} style={{ margin: "0 auto 12px", display: "block" }} />
                  No products found
                </td>
              </tr>
            ) : (
              filtered.map(product => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,0,0,0.03)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                        {product.image}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-purple">{product.category}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-muted)" }}>{product.sku}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{formatCurrency(product.price)}</td>
                  <td>
                    <span style={{ color: product.stock === 0 ? "var(--accent-red)" : product.stock <= 5 ? "var(--accent-orange)" : "var(--text-secondary)", fontWeight: product.stock <= 5 ? 600 : 400, fontSize: 13 }}>
                      {product.stock === 0 ? "Out of stock" : `${product.stock} units`}
                    </span>
                  </td>
                  <td>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input type="checkbox" className="toggle" checked={product.active} onChange={() => handleToggle(product.id)} />
                      <span style={{ fontSize: 12, color: product.active ? "var(--accent-green)" : "var(--text-muted)" }}>
                        {product.active ? "Active" : "Hidden"}
                      </span>
                    </label>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn-icon tooltip" data-tip="Edit"><Edit2 size={14} /></button>
                      <button className="btn-icon tooltip" data-tip="Delete" onClick={() => setDeleteId(product.id)} style={{ color: "var(--accent-red)" }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" style={{ maxWidth: 380, padding: 28 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Trash2 size={22} color="var(--accent-red)" />
              </div>
              <h2 style={{ fontSize: 18, marginBottom: 8 }}>Delete Product?</h2>
              <p style={{ fontSize: 14, color: "var(--text-muted)" }}>This action cannot be undone. The product will be removed from your catalog and WhatsApp AI.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-danger" style={{ flex: 1, justifyContent: "center" }} onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onSave={handleAdd} />}
    </div>
  );
}
